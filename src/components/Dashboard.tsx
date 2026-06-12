'use client';

import React, { useState, useEffect } from 'react';
import { Match, Team, Stage } from '../types';
import { MatchCard } from './MatchCard';
import { GroupStandings } from './GroupStandings';
import { calculateStandings, updateKnockoutMatches, fetchLiveMatches } from '../services/dataService';
import { TRANSLATIONS, Language } from '../data/translations';
import styles from '../app/page.module.css';

interface DashboardProps {
  initialMatches: Match[];
  teams: Team[];
}

export const Dashboard: React.FC<DashboardProps> = ({ initialMatches, teams }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<'GROUP' | 'KNOCKOUT'>('GROUP');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedKnockoutStage, setSelectedKnockoutStage] = useState<Stage | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [language, setLanguage] = useState<Language>('de');
  const [currentTeams, setCurrentTeams] = useState<Team[]>(teams);

  // Initialisiere Matches und Teams aus API (Live-Daten), localStorage oder Props
  useEffect(() => {
    const savedLang = localStorage.getItem('wm_2026_lang') as Language;
    if (savedLang && ['de', 'en', 'es', 'fr', 'ru', 'uk'].includes(savedLang)) {
      setLanguage(savedLang);
    }
    const loadData = async () => {
      // 1. Versuche Live-Daten zu laden
      try {
        const live = await fetchLiveMatches();
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

  const t = TRANSLATIONS[language];

  if (!mounted) {
    return <div className={styles.emptyState}>{TRANSLATIONS[language]?.loading || 'Loading...'}</div>;
  }

  const syncLiveResults = async () => {
    setSyncing(true);
    try {
      const live = await fetchLiveMatches();
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

  const handleScoreChange = (
    matchId: number,
    homeScore: number | null,
    awayScore: number | null,
    homePenaltyScore?: number | null,
    awayPenaltyScore?: number | null,
    finished?: boolean
  ) => {
    let updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return {
          ...m,
          homeScore,
          awayScore,
          homePenaltyScore: homePenaltyScore ?? undefined,
          awayPenaltyScore: awayPenaltyScore ?? undefined,
          finished: finished ?? false,
        };
      }
      return m;
    });

    // Berechne K.o.-Runden automatisch weiter
    updatedMatches = updateKnockoutMatches(updatedMatches, currentTeams);

    setMatches(updatedMatches);
    localStorage.setItem('wm_2026_matches', JSON.stringify(updatedMatches));
  };

  // Simuliert alle noch nicht gespielten Partien
  const simulateAllMatches = () => {
    let simulated = matches.map((m) => {
      if (m.finished) return m;

      // Generiere realistische Fußball-Ergebnisse
      const randomScore = () => {
        const r = Math.random();
        if (r < 0.3) return 0;
        if (r < 0.6) return 1;
        if (r < 0.8) return 2;
        if (r < 0.93) return 3;
        return 4;
      };

      const homeScore = randomScore();
      const awayScore = randomScore();
      let homePenaltyScore: number | undefined;
      let awayPenaltyScore: number | undefined;

      // Falls K.o.-Spiel und unentschieden -> Elfmeterschießen simulieren
      if (m.stage !== 'GROUP' && homeScore === awayScore) {
        const penHome = Math.floor(Math.random() * 3) + 3;
        const penAway = penHome + (Math.random() > 0.5 ? 1 : -1);
        homePenaltyScore = penHome;
        awayPenaltyScore = penAway;
      }

      return {
        ...m,
        homeScore,
        awayScore,
        homePenaltyScore,
        awayPenaltyScore,
        finished: true,
      };
    });

    // Propagation der Gewinner in K.o.-Spiele
    simulated = updateKnockoutMatches(simulated, currentTeams);

    setMatches(simulated);
    localStorage.setItem('wm_2026_matches', JSON.stringify(simulated));
  };

  const resetAllMatches = () => {
    if (confirm(t.resetConfirm)) {
      setMatches(initialMatches);
      localStorage.removeItem('wm_2026_matches');
    }
  };

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

        {/* Language Selector */}
        <div className={styles.languageSelector}>
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
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={syncLiveResults} disabled={syncing} className={styles.btn}>
            {syncing ? t.liveSyncing : t.liveSync}
          </button>
          <button onClick={simulateAllMatches} className={`${styles.btn} ${styles.btnPrimary}`}>
            {t.simulateAll}
          </button>
          <button onClick={resetAllMatches} className={`${styles.btn} ${styles.btnDanger}`}>
            {t.reset}
          </button>
        </div>
      </div>

      {activeTab === 'GROUP' ? (
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
                    onScoreChange={handleScoreChange}
                    saveText={t.finalize}
                    savedText={t.saved}
                    penaltyText={t.penalty}
                    lang={language}
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
              teamLabel={language === 'en' ? 'Team' : language === 'es' ? 'Equipo' : language === 'fr' ? 'Équipe' : language === 'ru' ? 'Команда' : language === 'uk' ? 'Команда' : 'Team'}
              playedLabel={language === 'en' ? 'GP' : language === 'fr' ? 'MJ' : language === 'es' ? 'PJ' : language === 'ru' ? 'И' : language === 'uk' ? 'І' : 'Sp'}
              diffLabel={language === 'en' ? 'GD' : language === 'fr' ? 'DB' : language === 'es' ? 'DG' : language === 'ru' ? 'РМ' : language === 'uk' ? 'РМ' : 'TD'}
              pointsLabel={language === 'en' ? 'Pts' : language === 'fr' ? 'Pts' : language === 'es' ? 'Pts' : language === 'ru' ? 'О' : language === 'uk' ? 'О' : 'Pkt'}
              groupLabel={t.group}
            />
          </div>
        </div>
      ) : (
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
                    onScoreChange={handleScoreChange}
                    saveText={t.finalize}
                    savedText={t.saved}
                    penaltyText={t.penalty}
                    lang={language}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
