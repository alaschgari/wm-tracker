'use client';

import React, { useState, useEffect } from 'react';
import { Match, Team, Stage } from '../types';
import { MatchCard } from './MatchCard';
import { GroupStandings } from './GroupStandings';
import { TimeMatrix } from './TimeMatrix';
import { calculateStandings, updateKnockoutMatches, fetchLiveMatchesFromApi } from '../services/dataService';
import { TRANSLATIONS, Language } from '../data/translations';
import styles from '../app/page.module.css';

interface DashboardProps {
  initialMatches: Match[];
  teams: Team[];
}

export const Dashboard: React.FC<DashboardProps> = ({ initialMatches, teams }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'GROUP' | 'KNOCKOUT' | 'MATRIX'>('GROUP');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedKnockoutStage, setSelectedKnockoutStage] = useState<Stage | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [language, setLanguage] = useState<Language>('de');
  const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);
  const [timezone, setTimezone] = useState<string>('Europe/Berlin');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (systemTz) {
        setTimezone(systemTz);
      }
    } catch (e) {
      console.log('Failed to detect system timezone', e);
    }

    try {
      const savedFavorites = localStorage.getItem('wm_2026_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.log('Failed to load favorites', e);
    }
  }, []);

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

    const savedLang = localStorage.getItem('wm_2026_lang') as Language;
    if (savedLang && ['de', 'en', 'es', 'fr', 'ru', 'uk'].includes(savedLang)) {
      setLanguage(savedLang);
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
        } catch (e) {
          setCurrentTeams(teams);
        }
      } else {
        setCurrentTeams(teams);
      }

      if (saved) {
        try {
          setMatches(JSON.parse(saved));
        } catch (e) {
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
  const standings = calculateStandings(matches, currentTeams);

  // Filtere Matches nach Gruppenphase vs K.o.-Phase
  const filteredMatches = matches.filter((m) => {
    if (activeTab === 'GROUP') {
      if (m.stage !== 'GROUP') return false;
      return selectedGroup === 'ALL' || m.group === selectedGroup;
    } else {
      if (m.stage === 'GROUP') return false;
      return selectedKnockoutStage === 'ALL' || m.stage === selectedKnockoutStage;
    }
  });



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
              teamLabel={language === 'en' ? 'Team' : language === 'es' ? 'Equipo' : language === 'fr' ? 'Équipe' : language === 'ru' ? 'Команда' : language === 'uk' ? 'Команда' : 'Team'}
              playedLabel={language === 'en' ? 'GP' : language === 'fr' ? 'MJ' : language === 'es' ? 'PJ' : language === 'ru' ? 'И' : language === 'uk' ? 'І' : 'Sp'}
              diffLabel={language === 'en' ? 'GD' : language === 'fr' ? 'DB' : language === 'es' ? 'DG' : language === 'ru' ? 'РМ' : language === 'uk' ? 'РМ' : 'TD'}
              pointsLabel={language === 'en' ? 'Pts' : language === 'fr' ? 'Pts' : language === 'es' ? 'Pts' : language === 'ru' ? 'О' : language === 'uk' ? 'О' : 'Pkt'}
              groupLabel={t.group}
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
    </div>
  );
};
