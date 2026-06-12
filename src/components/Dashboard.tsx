'use client';

import React, { useState, useEffect } from 'react';
import { Match, Team, Stage } from '../types';
import { MatchCard } from './MatchCard';
import { GroupStandings } from './GroupStandings';
import { calculateStandings, updateKnockoutMatches, fetchLiveMatches } from '../services/dataService';
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

  // Initialisiere Matches aus API (Live-Daten), localStorage oder Props
  useEffect(() => {
    const loadData = async () => {
      // 1. Versuche Live-Daten zu laden
      try {
        const live = await fetchLiveMatches();
        if (live && live.length > 0) {
          const propagated = updateKnockoutMatches(live, teams);
          setMatches(propagated);
          localStorage.setItem('wm_2026_matches', JSON.stringify(propagated));
          setMounted(true);
          return;
        }
      } catch (err) {
        console.log('Failed to fetch live matches on mount, fallback to localStorage', err);
      }

      // 2. Fallback auf localStorage oder Props
      const saved = localStorage.getItem('wm_2026_matches');
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

  if (!mounted) {
    return <div className={styles.emptyState}>Lade WM Tracker...</div>;
  }

  const syncLiveResults = async () => {
    setSyncing(true);
    try {
      const live = await fetchLiveMatches();
      if (live && live.length > 0) {
        const propagated = updateKnockoutMatches(live, teams);
        setMatches(propagated);
        localStorage.setItem('wm_2026_matches', JSON.stringify(propagated));
      }
    } catch (e) {
      alert('Fehler beim Abrufen der Live-Daten.');
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
    updatedMatches = updateKnockoutMatches(updatedMatches, teams);

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
    simulated = updateKnockoutMatches(simulated, teams);

    setMatches(simulated);
    localStorage.setItem('wm_2026_matches', JSON.stringify(simulated));
  };

  const resetAllMatches = () => {
    if (confirm('Möchtest du wirklich alle Ergebnisse zurücksetzen?')) {
      setMatches(initialMatches);
      localStorage.removeItem('wm_2026_matches');
    }
  };

  // Berechne aktuelle Tabellen
  const standings = calculateStandings(matches, teams);

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
    { value: 'ALL', label: 'Alle Runden' },
    { value: 'ROUND_OF_32', label: 'Runde der 32' },
    { value: 'ROUND_OF_16', label: 'Achtelfinale' },
    { value: 'QUARTER_FINALS', label: 'Viertelfinale' },
    { value: 'SEMI_FINALS', label: 'Halbfinale' },
    { value: 'THIRD_PLACE', label: 'Spiel um Platz 3' },
    { value: 'FINAL', label: 'Finale' },
  ];

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>FIFA World Cup 2026</h1>
        <p className={styles.subtitle}>
          Ergebnis-Tracker & interaktiver Turniersimulator. Trage Tore ein oder simuliere das gesamte Turnier.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('GROUP')}
            className={`${styles.tabButton} ${activeTab === 'GROUP' ? styles.tabButtonActive : ''}`}
          >
            Gruppenphase
          </button>
          <button
            onClick={() => setActiveTab('KNOCKOUT')}
            className={`${styles.tabButton} ${activeTab === 'KNOCKOUT' ? styles.tabButtonActive : ''}`}
          >
            K.o.-Phase
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={syncLiveResults} disabled={syncing} className={styles.btn}>
            {syncing ? '⌛ Synchronisiere...' : '🔄 Live-Sync'}
          </button>
          <button onClick={simulateAllMatches} className={`${styles.btn} ${styles.btnPrimary}`}>
            ⚡ Alle simulieren
          </button>
          <button onClick={resetAllMatches} className={`${styles.btn} ${styles.btnDanger}`}>
            ↺ Zurücksetzen
          </button>
        </div>
      </div>

      {activeTab === 'GROUP' ? (
        <div className={`${styles.layout} ${styles.layoutTwoCol}`}>
          {/* Linke Spalte: Spiele */}
          <div>
            <h2 className={styles.sectionTitle}>⚽ Gruppenspiele</h2>
            <div className={styles.filterBar}>
              {groupList.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`${styles.filterChip} ${selectedGroup === g ? styles.filterChipActive : ''}`}
                >
                  {g === 'ALL' ? 'Alle Gruppen' : `Gruppe ${g}`}
                </button>
              ))}
            </div>
            
            <div className={styles.matchesList}>
              {filteredMatches.length === 0 ? (
                <div className={styles.emptyState}>Keine Spiele gefunden.</div>
              ) : (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={teams}
                    onScoreChange={handleScoreChange}
                  />
                ))
              )}
            </div>
          </div>

          {/* Rechte Spalte: Tabellen */}
          <div>
            <h2 className={styles.sectionTitle}>🏆 Live-Tabellen</h2>
            <GroupStandings standings={standings} teams={teams} />
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>🛡️ K.o.-Runden Baum</h2>
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
                <div className={styles.emptyState}>Keine K.o.-Spiele vorhanden. Schließe die Gruppenphase ab, um Teams zu qualifizieren.</div>
              ) : (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={teams}
                    onScoreChange={handleScoreChange}
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
