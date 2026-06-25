'use client';

import React, { useState, useEffect } from 'react';
import { Match, Team, Stage } from '../types';
import { MatchCard } from './MatchCard';
import { GroupStandings } from './GroupStandings';
import { TimeMatrix } from './TimeMatrix';
import { calculateStandings, updateKnockoutMatches, fetchLiveMatchesFromApi, calculateTopScorers, calculateTeamStats, calculateAllStats } from '../services/dataService';
import { TRANSLATIONS, Language } from '../data/translations';
import styles from '../app/page.module.css';

interface DashboardProps {
  initialMatches: Match[];
  teams: Team[];
}

export const Dashboard: React.FC<DashboardProps> = ({ initialMatches, teams }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'GROUP' | 'KNOCKOUT' | 'MATRIX' | 'SCORERS'>('GROUP');
  const [activeStatsSubTab, setActiveStatsSubTab] = useState<'SCORERS' | 'GOALS' | 'MATCHES' | 'TEAMS'>('SCORERS');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedKnockoutStage, setSelectedKnockoutStage] = useState<Stage | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('wm_2026_lang') as Language;
      if (savedLang && ['de', 'en', 'es', 'fr', 'ru', 'uk'].includes(savedLang)) {
        return savedLang;
      }
    }
    return 'de';
  });
  const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);
  const [timezone, setTimezone] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';
      } catch {
        return 'Europe/Berlin';
      }
    }
    return 'Europe/Berlin';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem('wm_2026_favorites');
        if (savedFavorites) {
          return JSON.parse(savedFavorites);
        }
      } catch (e) {
        console.log('Failed to load favorites', e);
      }
    }
    return [];
  });

  const toggleFavorite = (teamId: string) => {
    if (!teamId || teamId.startsWith('W') || teamId.startsWith('RU') || teamId.includes(' ') || teamId.length > 3) return;
    setFavorites((prev) => {
      const next = prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId];
      localStorage.setItem('wm_2026_favorites', JSON.stringify(next));
      return next;
    });
  };

  const timezones = [
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
    { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Berlin', label: 'Berlin / Paris (CET/CEST)' },
    { value: 'Europe/Kyiv', label: 'Kyiv (EET/EEST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'UTC', label: 'UTC' }
  ];

  const timezoneOptions = [...timezones];
  if (timezone && !timezones.some(t => t.value === timezone)) {
    timezoneOptions.unshift({ value: timezone, label: `${timezone} (Local)` });
  }

  // Initialisiere Matches und Teams aus API (Live-Daten), localStorage oder Props
  useEffect(() => {
    const APP_VERSION = '1.2';
    const savedVersion = localStorage.getItem('wm_2026_version');
    if (savedVersion !== APP_VERSION) {
      localStorage.removeItem('wm_2026_matches');
      localStorage.removeItem('wm_2026_teams');
      localStorage.setItem('wm_2026_version', APP_VERSION);
    }


    const loadData = async () => {
      // 1. Versuche Live-Daten zu laden
      try {
        const live = await fetchLiveMatchesFromApi();
        if (live && live.matches.length > 0) {
          const propagated = updateKnockoutMatches(live.matches, live.teams);
          setMatches(propagated);
          setCurrentTeams(live.teams);
          localStorage.setItem('wm_2026_matches', JSON.stringify(propagated));
          localStorage.setItem('wm_2026_teams', JSON.stringify(live.teams));
          setMounted(true);
          return;
        }
      } catch (err) {
        console.log('Failed to fetch live matches on mount, fallback to localStorage', err);
      }

      // 2. Fallback auf localStorage oder Props
      const saved = localStorage.getItem('wm_2026_matches');
      const savedTeams = localStorage.getItem('wm_2026_teams');
      
      if (savedTeams) {
        try {
          setCurrentTeams(JSON.parse(savedTeams));
        } catch {
          setCurrentTeams(teams);
        }
      } else {
        setCurrentTeams(teams);
      }

      if (saved) {
        try {
          setMatches(JSON.parse(saved));
        } catch {
          setMatches(initialMatches);
        }
      } else {
        setMatches(initialMatches);
      }
      setMounted(true);
    };

    loadData();
  }, [initialMatches, teams]);

  // Berechne aktuelle Tabellen
  const standings = React.useMemo(() => calculateStandings(matches, currentTeams), [matches, currentTeams]);

  // Berechne Topscorer
  const topScorers = React.useMemo(() => calculateTopScorers(matches), [matches]);

  // Berechne Teamscorer-Statistiken
  const teamScorerStats = React.useMemo(() => calculateTeamStats(matches), [matches]);

  // Berechne alle Statistiken aggregiert
  const stats = React.useMemo(() => calculateAllStats(matches), [matches]);

  // Filtere Matches nach Gruppenphase vs K.o.-Phase
  const filteredMatches = React.useMemo(() => {
    return matches.filter((m) => {
      if (activeTab === 'GROUP') {
        if (m.stage !== 'GROUP') return false;
        return selectedGroup === 'ALL' || m.group === selectedGroup;
      } else {
        if (m.stage === 'GROUP') return false;
        return selectedKnockoutStage === 'ALL' || m.stage === selectedKnockoutStage;
      }
    });
  }, [matches, activeTab, selectedGroup, selectedKnockoutStage]);




  const t = TRANSLATIONS[language];

  if (!mounted) {
    return <div className={styles.emptyState}>{TRANSLATIONS[language]?.loading || 'Loading...'}</div>;
  }

  const syncLiveResults = async () => {
    setSyncing(true);
    try {
      const live = await fetchLiveMatchesFromApi();
      if (live && live.matches.length > 0) {
        const propagated = updateKnockoutMatches(live.matches, live.teams);
        setMatches(propagated);
        setCurrentTeams(live.teams);
        localStorage.setItem('wm_2026_matches', JSON.stringify(propagated));
        localStorage.setItem('wm_2026_teams', JSON.stringify(live.teams));
      }
    } catch (e) {
      console.error('Error syncing live results:', e);
      alert(t.liveSyncError);
    } finally {
      setSyncing(false);
    }
  };

  const groupList = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const knockoutStages: { value: Stage | 'ALL'; label: string }[] = [
    { value: 'ALL', label: t.allRounds },
    { value: 'ROUND_OF_32', label: t.round32 },
    { value: 'ROUND_OF_16', label: t.round16 },
    { value: 'QUARTER_FINALS', label: t.quarterFinals },
    { value: 'SEMI_FINALS', label: t.semiFinals },
    { value: 'THIRD_PLACE', label: t.thirdPlace },
    { value: 'FINAL', label: t.final },
  ];

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        {/* Language Selector & Timezone Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <div className={styles.languageSelector} style={{ marginTop: 0 }}>
            {(['de', 'en', 'es', 'fr', 'ru', 'uk'] as Language[]).map((lang) => {
              const flags: Record<Language, string> = {
                de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', ru: '🇷🇺', uk: '🇺🇦'
              };
              return (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    localStorage.setItem('wm_2026_lang', lang);
                  }}
                  className={`${styles.langBtn} ${language === lang ? styles.langBtnActive : ''}`}
                >
                  <span>{flags[lang]}</span>
                  <span>{lang.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.selectTimezone}:</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={styles.knockoutSelect}
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            >
              {timezoneOptions.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('GROUP')}
            className={`${styles.tabButton} ${activeTab === 'GROUP' ? styles.tabButtonActive : ''}`}
          >
            {t.groupStage}
          </button>
          <button
            onClick={() => setActiveTab('KNOCKOUT')}
            className={`${styles.tabButton} ${activeTab === 'KNOCKOUT' ? styles.tabButtonActive : ''}`}
          >
            {t.knockoutStage}
          </button>
          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`${styles.tabButton} ${activeTab === 'MATRIX' ? styles.tabButtonActive : ''}`}
          >
            {t.timeMatrix}
          </button>
          <button
            onClick={() => setActiveTab('SCORERS')}
            className={`${styles.tabButton} ${activeTab === 'SCORERS' ? styles.tabButtonActive : ''}`}
          >
            {t.topScorers}
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={syncLiveResults} disabled={syncing} className={styles.btn}>
            {syncing ? t.liveSyncing : t.liveSync}
          </button>
        </div>
      </div>

      {activeTab === 'GROUP' && (
        <div className={`${styles.layout} ${styles.layoutTwoCol}`}>
          {/* Linke Spalte: Spiele */}
          <div>
            <h2 className={styles.sectionTitle}>{t.groupMatches}</h2>
            <div className={styles.filterBar}>
              {groupList.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`${styles.filterChip} ${selectedGroup === g ? styles.filterChipActive : ''}`}
                >
                  {g === 'ALL' ? t.allGroups : `${t.group} ${g}`}
                </button>
              ))}
            </div>
            
            <div className={styles.matchesList}>
              {filteredMatches.length === 0 ? (
                <div className={styles.emptyState}>-</div>
              ) : (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={currentTeams}
                    lang={language}
                    timezone={timezone}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                ))
              )}
            </div>
          </div>

          {/* Rechte Spalte: Tabellen */}
          <div>
            <h2 className={styles.sectionTitle}>{t.liveStandings}</h2>
             <GroupStandings
              standings={standings}
              teams={currentTeams}
              lang={language}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      )}

      {activeTab === 'KNOCKOUT' && (
        <div className={styles.layout}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>{t.matchTree}</h2>
              <select
                value={selectedKnockoutStage}
                onChange={(e) => setSelectedKnockoutStage(e.target.value as Stage | 'ALL')}
                className={styles.knockoutSelect}
              >
                {knockoutStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.matchesList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', maxHeight: 'none' }}>
              {filteredMatches.length === 0 ? (
                <div className={styles.emptyState}>-</div>
              ) : (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={currentTeams}
                    lang={language}
                    timezone={timezone}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MATRIX' && (
        <TimeMatrix matches={matches} teams={currentTeams} lang={language} timezone={timezone} favorites={favorites} />
      )}

      {activeTab === 'SCORERS' && (
        <div style={{ width: '100%' }}>
          {/* Unter-Menü für Statistiken */}
          <div className={styles.subTabs}>
            <button
              onClick={() => setActiveStatsSubTab('SCORERS')}
              className={`${styles.subTabButton} ${activeStatsSubTab === 'SCORERS' ? styles.subTabButtonActive : ''}`}
            >
              ⚽ {language === 'de' ? 'Torjäger' : 'Goal Scorers'}
            </button>
            <button
              onClick={() => setActiveStatsSubTab('GOALS')}
              className={`${styles.subTabButton} ${activeStatsSubTab === 'GOALS' ? styles.subTabButtonActive : ''}`}
            >
              ⏱️ {language === 'de' ? 'Tor-Events' : 'Goal Events'}
            </button>
            <button
              onClick={() => setActiveStatsSubTab('MATCHES')}
              className={`${styles.subTabButton} ${activeStatsSubTab === 'MATCHES' ? styles.subTabButtonActive : ''}`}
            >
              🏆 {language === 'de' ? 'Spiel-Rekorde' : 'Match Records'}
            </button>
            <button
              onClick={() => setActiveStatsSubTab('TEAMS')}
              className={`${styles.subTabButton} ${activeStatsSubTab === 'TEAMS' ? styles.subTabButtonActive : ''}`}
            >
              📊 {language === 'de' ? 'Team & Gruppe' : 'Team & Group'}
            </button>
          </div>

          {/* Sub-Tab 1: Torjäger (Die 3 Listen aus dem vorherigen Schritt) */}
          {activeStatsSubTab === 'SCORERS' && (
            <div className={styles.scorersThreeColLayout}>
              {/* Spalte 1: Top-Torschützen (Einzelwertung) */}
              <div className={styles.scorersColumn}>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>{language === 'de' ? 'Top-Torschützen' : 'Top Scorers'}</h3>
                {topScorers.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.scorersListCard}>
                    {topScorers.slice(0, 20).map((scorer, index) => {
                      const team = currentTeams.find(t => t.id === scorer.teamId);
                      return (
                        <div key={scorer.name} className={styles.scorersListItem}>
                          <span className={styles.scorerRank}>{index + 1}.</span>
                          <div className={styles.scorerTeamInfo} style={{ minWidth: 'auto', marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            {team?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={team.iconUrl} alt="" className={styles.teamScorerLogo} style={{ width: '20px', height: '13px' }} />
                            ) : (
                              <span>{team?.flag || '🏳️'}</span>
                            )}
                          </div>
                          <span className={styles.scorerNameText} style={{ flex: 1, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{scorer.name}</span>
                          <span className={styles.teamGoalsBadge} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{scorer.goals}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Spalte 2: Team-Tore (Mannschaftswertung) */}
              <div className={styles.scorersColumn}>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>{language === 'de' ? 'Team-Tore' : 'Team Goals'}</h3>
                {teamScorerStats.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.scorersListCard}>
                    {teamScorerStats.map((teamStats, index) => {
                      const team = currentTeams.find(t => t.id === teamStats.teamId);
                      return (
                        <div key={teamStats.teamId} className={styles.scorersListItem}>
                          <span className={styles.scorerRank}>{index + 1}.</span>
                          <div className={styles.scorerTeamInfo} style={{ flex: 1, minWidth: 'auto', display: 'flex', alignItems: 'center' }}>
                            {team?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={team.iconUrl} alt="" className={styles.teamScorerLogo} style={{ width: '20px', height: '13px' }} />
                            ) : (
                              <span>{team?.flag || '🏳️'}</span>
                            )}
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '0.5rem', color: 'var(--text-primary)' }}>{team?.name || teamStats.teamId}</span>
                          </div>
                          <span className={styles.teamGoalsBadge} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{teamStats.totalGoals}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Spalte 3: Top-Schützen pro Land */}
              <div className={styles.scorersColumn}>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>{language === 'de' ? 'Top-Schützen pro Land' : 'Top Scorers per Team'}</h3>
                {teamScorerStats.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.teamScorerList}>
                    {teamScorerStats.map((teamStats, index) => {
                      const team = currentTeams.find(t => t.id === teamStats.teamId);
                      return (
                        <div key={teamStats.teamId} className={styles.teamScorerCard} style={{ padding: '0.85rem' }}>
                          <div className={styles.teamScorerHeader} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <div className={styles.teamScorerInfo}>
                              <span className={styles.teamScorerRank}>{index + 1}.</span>
                              {team?.iconUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={team.iconUrl} alt="" className={styles.teamScorerLogo} />
                              ) : (
                                <span className={styles.scorerTeamFlag}>{team?.flag || '🏳️'}</span>
                              )}
                              <span className={styles.teamScorerName}>{team?.name || teamStats.teamId}</span>
                            </div>
                          </div>
                          
                          <div className={styles.playerScorersList} style={{ marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                            {teamStats.scorers.map((player) => (
                              <div key={player.name} className={styles.playerScorerItem} style={{ fontSize: '0.75rem' }}>
                                <span className={styles.playerScorerBullet}>•</span>
                                <span className={styles.playerScorerName}>{player.name}</span>
                                <span className={styles.playerScorerGoals}>({player.goals})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Tor-Events */}
          {activeStatsSubTab === 'GOALS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              {/* Elfmeter & Eigentore Box */}
              <div>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>📊 {language === 'de' ? 'Turnier-Ereignisse' : 'Tournament Events'}</h3>
                <div className={styles.statsListCard} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.25rem' }}>
                  <div style={{ textAlign: 'center', background: 'rgba(10, 15, 26, 0.3)', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.75rem' }}>⚽</span>
                    <h4 style={{ margin: '5px 0 2px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{language === 'de' ? 'Elfmeter' : 'Penalties'}</h4>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{stats.penaltiesOwnGoals.totalPenalties}</strong>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(10, 15, 26, 0.3)', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.75rem' }}>⚠️</span>
                    <h4 style={{ margin: '5px 0 2px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{language === 'de' ? 'Eigentore' : 'Own Goals'}</h4>
                    <strong style={{ fontSize: '1.5rem', color: '#EF4444' }}>{stats.penaltiesOwnGoals.totalOwnGoals}</strong>
                  </div>
                </div>
              </div>

              {/* Grid für schnellste und späte Tore nebeneinander */}
              <div className={styles.statsGridTwoCol}>
                {/* Blitz-Tore */}
                <div>
                  <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>⚡ {language === 'de' ? 'Schnellste Tore (Top 10)' : 'Fastest Goals (Top 10)'}</h3>
                  {stats.fastestGoals.length === 0 ? (
                    <div className={styles.emptyState}>-</div>
                  ) : (
                    <div className={styles.statsListCard}>
                      {stats.fastestGoals.map((goal, idx) => {
                        const team = currentTeams.find(t => t.id === goal.teamId);
                        return (
                          <div key={`${goal.scorer}-${goal.minute}-${idx}`} className={styles.statsItem}>
                            <div className={styles.statsItemLeft}>
                              <span className={styles.scorerRank}>{idx + 1}.</span>
                              {team?.iconUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={team.iconUrl} alt="" className={styles.statsTeamLogo} />
                              ) : (
                                <span>{team?.flag || '🏳️'}</span>
                              )}
                              <span className={styles.scorerNameText} style={{ fontWeight: 600 }}>{goal.scorer}</span>
                            </div>
                            <span className={styles.statsItemRight}>{goal.minute}&apos;. Min</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Späte Tore (Last Minute) */}
                <div>
                  <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>⏱️ {language === 'de' ? 'Späte Tore (ab 85. Min)' : 'Late Goals (85th Min+)'}</h3>
                  {stats.lateGoals.length === 0 ? (
                    <div className={styles.emptyState}>-</div>
                  ) : (
                    <div className={styles.statsListCard}>
                      {stats.lateGoals.map((goal, idx) => {
                        const team = currentTeams.find(t => t.id === goal.teamId);
                        return (
                          <div key={`${goal.scorer}-${goal.minute}-${idx}`} className={styles.statsItem}>
                            <div className={styles.statsItemLeft}>
                              <span className={styles.scorerRank}>{idx + 1}.</span>
                              {team?.iconUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={team.iconUrl} alt="" className={styles.statsTeamLogo} />
                              ) : (
                                <span>{team?.flag || '🏳️'}</span>
                              )}
                              <span className={styles.scorerNameText} style={{ fontWeight: 600 }}>{goal.scorer}</span>
                            </div>
                            <span className={styles.statsItemRight}>{goal.minute}&apos;. Min ({goal.scoreAfter})</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Spiel-Rekorde */}
          {activeStatsSubTab === 'MATCHES' && (
            <div className={styles.statsGridTwoCol}>
              {/* Torreichste Spiele */}
              <div>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>🔥 {language === 'de' ? 'Torreichste Spiele' : 'Highest Scoring Matches'}</h3>
                {stats.highestScoringMatches.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.statsListCard}>
                    {stats.highestScoringMatches.map((m, idx) => {
                      const home = currentTeams.find(t => t.id === m.homeTeam);
                      const away = currentTeams.find(t => t.id === m.awayTeam);
                      return (
                        <div key={`${m.matchId}-${idx}`} className={styles.statsItem}>
                          <div className={styles.statsItemLeft} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <span className={styles.scorerRank}>{idx + 1}.</span>
                            {home?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={home.iconUrl} alt="" className={styles.statsTeamLogo} />
                            ) : (
                              <span>{home?.flag || '🏳️'}</span>
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{home?.name || m.homeTeam}</span>
                            <span style={{ margin: '0 0.2rem', opacity: 0.5, color: 'var(--text-secondary)' }}>-</span>
                            {away?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={away.iconUrl} alt="" className={styles.statsTeamLogo} />
                            ) : (
                              <span>{away?.flag || '🏳️'}</span>
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>{away?.name || m.awayTeam}</span>
                          </div>
                          <span className={styles.statsScore}>{m.homeScore}:{m.awayScore}</span>
                          <span className={styles.statsItemRight}>({m.totalGoals})</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Höchste Siege */}
              <div>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>🏆 {language === 'de' ? 'Höchste Siege' : 'Biggest Wins'}</h3>
                {stats.biggestWins.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.statsListCard}>
                    {stats.biggestWins.map((m, idx) => {
                      const home = currentTeams.find(t => t.id === m.homeTeam);
                      const away = currentTeams.find(t => t.id === m.awayTeam);
                      const winner = currentTeams.find(t => t.id === m.winnerId);
                      return (
                        <div key={`${m.matchId}-${idx}`} className={styles.statsItem}>
                          <div className={styles.statsItemLeft} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <span className={styles.scorerRank}>{idx + 1}.</span>
                            {winner?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={winner.iconUrl} alt="" className={styles.statsTeamLogo} />
                            ) : (
                              <span>{winner?.flag || '🏳️'}</span>
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{winner?.name || m.winnerId}</span>
                            <span className={styles.statsMeta} style={{ marginLeft: '0.35rem', fontSize: '0.75rem' }}>
                              ({home?.name} {m.homeScore}:{m.awayScore} {away?.name})
                            </span>
                          </div>
                          <span className={styles.statsItemRight}>+{m.difference}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Team & Gruppe */}
          {activeStatsSubTab === 'TEAMS' && (
            <div className={styles.statsGridTwoCol}>
              {/* Clean Sheets (Weiße Weste) */}
              <div>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>🧤 {language === 'de' ? 'Weiße Weste (Clean Sheets)' : 'Clean Sheets'}</h3>
                {stats.cleanSheets.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.statsListCard}>
                    {stats.cleanSheets.map((cs, idx) => {
                      const team = currentTeams.find(t => t.id === cs.teamId);
                      return (
                        <div key={`${cs.teamId}-${idx}`} className={styles.statsItem}>
                          <div className={styles.statsItemLeft}>
                            <span className={styles.scorerRank}>{idx + 1}.</span>
                            {team?.iconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={team.iconUrl} alt="" className={styles.statsTeamLogo} />
                            ) : (
                              <span>{team?.flag || '🏳️'}</span>
                            )}
                            <span className={styles.scorerNameText} style={{ fontWeight: 600 }}>{team?.name || cs.teamId}</span>
                            <span className={styles.statsMeta} style={{ marginLeft: '0.35rem' }}>({cs.played} {language === 'de' ? 'Spiele' : 'Matches'})</span>
                          </div>
                          <span className={styles.statsItemRight}>{cs.cleanSheets}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Torreichste Gruppen */}
              <div>
                <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>{language === 'de' ? 'Vorrunden-Gruppen (Tore)' : 'Group Phase Goals'}</h3>
                {stats.groupGoals.length === 0 ? (
                  <div className={styles.emptyState}>-</div>
                ) : (
                  <div className={styles.statsListCard}>
                    {stats.groupGoals.map((gg, idx) => {
                      return (
                        <div key={`${gg.group}-${idx}`} className={styles.statsItem}>
                          <div className={styles.statsItemLeft}>
                            <span className={styles.scorerRank}>{idx + 1}.</span>
                            <span className={styles.scorerNameText} style={{ fontWeight: 700 }}>{language === 'de' ? `Gruppe ${gg.group}` : `Group ${gg.group}`}</span>
                          </div>
                          <span className={styles.statsItemRight}>{gg.goals} {gg.goals === 1 ? (language === 'de' ? 'Tor' : 'Goal') : (language === 'de' ? 'Tore' : 'Goals')}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
