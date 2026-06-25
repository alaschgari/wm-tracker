import React from 'react';
import { Match, Team } from '../types';
import { TEAM_TRANSLATIONS, TRANSLATIONS, Language } from '../data/translations';
import styles from './TeamDetailsModal.module.css';

interface TeamDetailsModalProps {
  teamId: string | null;
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  teams: Team[];
  lang: Language;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  teamId,
  isOpen,
  onClose,
  matches,
  teams,
  lang
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !teamId) return null;

  const team = teams.find(t => t.id === teamId);
  const teamName = TEAM_TRANSLATIONS[teamId]?.[lang] || team?.name || teamId;
  const t = TRANSLATIONS[lang];

  // Berechne WM-Statistiken
  const stats = (() => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsScored = 0;
    let goalsConceded = 0;

    matches.forEach(m => {
      if (m.finished && m.homeScore !== null && m.awayScore !== null && (m.homeTeam === teamId || m.awayTeam === teamId)) {
        played++;
        const isHome = m.homeTeam === teamId;
        const myScore = isHome ? m.homeScore : m.awayScore;
        const oppScore = isHome ? m.awayScore : m.homeScore;
        goalsScored += myScore;
        goalsConceded += oppScore;
        if (myScore > oppScore) won++;
        else if (myScore === oppScore) drawn++;
        else lost++;
      }
    });

    const points = won * 3 + drawn;
    return { played, won, drawn, lost, goalsScored, goalsConceded, points };
  })();

  // Filter matches for this team
  const teamMatches = matches.filter(m => m.homeTeam === teamId || m.awayTeam === teamId);

  // Filter scorers for this team
  const teamScorers = (() => {
    const scorersMap: Record<string, number> = {};
    matches.forEach(m => {
      if (m.goals) {
        m.goals.forEach(g => {
          if (!g.isOwnGoal) {
            const scorerTeam = g.isHome ? m.homeTeam : m.awayTeam;
            if (scorerTeam === teamId) {
              const name = g.scorer.trim();
              if (name && name !== 'Unbekannt') {
                scorersMap[name] = (scorersMap[name] || 0) + 1;
              }
            }
          }
        });
      }
    });
    return Object.entries(scorersMap)
      .map(([name, goals]) => ({ name, goals }))
      .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
  })();

  const formatStage = (stage: string, group?: string) => {
    switch (stage) {
      case 'GROUP':
        return group ? `${t.group} ${group}` : t.groupStage;
      case 'ROUND_OF_32':
        return t.round32;
      case 'ROUND_OF_16':
        return t.round16;
      case 'QUARTER_FINALS':
        return t.quarterFinals;
      case 'SEMI_FINALS':
        return t.semiFinals;
      case 'THIRD_PLACE':
        return t.thirdPlace;
      case 'FINAL':
        return t.final;
      default:
        return stage;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        
        <header className={styles.modalHeader}>
          <span className={styles.bigFlag}>{team?.flag || '🏳️'}</span>
          <div>
            <h2 className={styles.teamTitle}>{teamName}</h2>
            <p className={styles.teamSubtitle}>{lang === 'de' ? `Kürzel: ${teamId}` : `Code: ${teamId}`}</p>
          </div>
        </header>

        <div className={styles.modalBody}>
          {/* Turnier-Statistik-Grid */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{lang === 'de' ? 'Turnier-Bilanz' : 'Tournament Stats'}</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Spiele' : 'Played'}</span>
                <span className={styles.statValue}>{stats.played}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Siege' : 'Won'}</span>
                <span className={styles.statValue} style={{ color: '#4ADE80' }}>{stats.won}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Remis' : 'Drawn'}</span>
                <span className={styles.statValue} style={{ color: '#94A3B8' }}>{stats.drawn}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Niederl.' : 'Lost'}</span>
                <span className={styles.statValue} style={{ color: '#F87171' }}>{stats.lost}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Tore' : 'Goals'}</span>
                <span className={styles.statValue}>{stats.goalsScored}:{stats.goalsConceded}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{lang === 'de' ? 'Punkte' : 'Points'}</span>
                <span className={styles.statValue} style={{ color: 'var(--accent-gold)' }}>{stats.points}</span>
              </div>
            </div>
          </section>

          {/* Zwei-Spalten-Bereich für Spiele und Torschützen */}
          <div className={styles.gridTwoCol}>
            {/* Spieleliste */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{lang === 'de' ? 'Spiele' : 'Matches'}</h3>
              <div className={styles.listContainer}>
                {teamMatches.length === 0 ? (
                  <p className={styles.emptyText}>-</p>
                ) : (
                  teamMatches.map(m => {
                    const opponentId = m.homeTeam === teamId ? m.awayTeam : m.homeTeam;
                    const opponent = teams.find(t => t.id === opponentId);
                    const oppName = TEAM_TRANSLATIONS[opponentId]?.[lang] || opponent?.name || opponentId;
                    const isHome = m.homeTeam === teamId;
                    
                    return (
                      <div key={m.id} className={styles.matchItem}>
                        <div className={styles.matchMeta}>
                          <span className={styles.stageTag}>{formatStage(m.stage, m.group)}</span>
                        </div>
                        <div className={styles.matchRow}>
                          <span className={styles.opponentFlag}>{opponent?.flag}</span>
                          <span className={styles.opponentName}>{oppName}</span>
                          <span className={styles.scoreBadge}>
                            {m.homeScore !== null && m.awayScore !== null ? (
                              isHome ? `${m.homeScore}:${m.awayScore}` : `${m.awayScore}:${m.homeScore}`
                            ) : (
                              'vs'
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Torschützenliste */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{lang === 'de' ? 'Torschützen' : 'Goal Scorers'}</h3>
              <div className={styles.listContainer}>
                {teamScorers.length === 0 ? (
                  <p className={styles.emptyText}>{lang === 'de' ? 'Keine Torschützen verzeichnet' : 'No scorers recorded'}</p>
                ) : (
                  teamScorers.map(s => (
                    <div key={s.name} className={styles.scorerItem}>
                      <span className={styles.scorerName}>{s.name}</span>
                      <span className={styles.scorerGoals}>⚽ {s.goals}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
