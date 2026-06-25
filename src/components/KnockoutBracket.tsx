import React from 'react';
import { Match, Team, Stage } from '../types';
import { TEAM_TRANSLATIONS, TRANSLATIONS, Language } from '../data/translations';
import styles from './KnockoutBracket.module.css';

interface KnockoutBracketProps {
  matches: Match[];
  teams: Team[];
  lang: Language;
  onTeamClick: (teamId: string) => void;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({
  matches,
  teams,
  lang,
  onTeamClick
}) => {
  const t = TRANSLATIONS[lang];

  // Gruppiere K.o.-Spiele
  const getMatchesByStage = (stage: Stage): Match[] => {
    return matches
      .filter(m => m.stage === stage)
      // Sortieren nach Datum/Uhrzeit oder ID, um eine konsistente Struktur im Bracket zu erhalten
      .sort((a, b) => a.id - b.id);
  };

  const stages: { value: Stage; label: string }[] = [
    { value: 'ROUND_OF_32', label: t.round32 },
    { value: 'ROUND_OF_16', label: t.round16 },
    { value: 'QUARTER_FINALS', label: t.quarterFinals },
    { value: 'SEMI_FINALS', label: t.semiFinals },
    { value: 'FINAL', label: t.final }
  ];

  const getTeamName = (teamId: string) => {
    if (!teamId) return '';
    return TEAM_TRANSLATIONS[teamId]?.[lang] || teams.find(t => t.id === teamId)?.name || teamId;
  };

  const getTeamFlag = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.flag || '🏳️';
  };

  const renderMatchBox = (match: Match) => {
    const homeName = getTeamName(match.homeTeam);
    const awayName = getTeamName(match.awayTeam);
    const homeFlag = getTeamFlag(match.homeTeam);
    const awayFlag = getTeamFlag(match.awayTeam);
    const isFinished = match.finished && match.homeScore !== null && match.awayScore !== null;
    const homeWon = isFinished && match.homeScore! > match.awayScore!;
    const awayWon = isFinished && match.awayScore! > match.homeScore!;

    return (
      <div key={match.id} className={styles.matchCard}>
        <div className={styles.matchIdTag}>Spiel {match.id}</div>
        
        {/* Heim-Team */}
        <div 
          className={`${styles.teamRow} ${homeWon ? styles.winner : ''} ${match.homeTeam ? styles.clickable : ''}`}
          onClick={() => match.homeTeam && onTeamClick(match.homeTeam)}
        >
          <span className={styles.flag}>{homeFlag}</span>
          <span className={styles.teamName} title={homeName}>{match.homeTeam || 'TBD'}</span>
          {isFinished && <span className={styles.score}>{match.homeScore}</span>}
        </div>

        {/* Gast-Team */}
        <div 
          className={`${styles.teamRow} ${awayWon ? styles.winner : ''} ${match.awayTeam ? styles.clickable : ''}`}
          onClick={() => match.awayTeam && onTeamClick(match.awayTeam)}
        >
          <span className={styles.flag}>{awayFlag}</span>
          <span className={styles.teamName} title={awayName}>{match.awayTeam || 'TBD'}</span>
          {isFinished && <span className={styles.score}>{match.awayScore}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.bracketContainer}>
      <div className={styles.bracketScrollArea}>
        {stages.map((stage) => {
          const stageMatches = getMatchesByStage(stage.value);
          return (
            <div key={stage.value} className={styles.bracketColumn}>
              <h3 className={styles.columnHeader}>{stage.label}</h3>
              <div className={`${styles.matchesContainer} ${styles[stage.value]}`}>
                {stageMatches.length === 0 ? (
                  <div className={styles.emptyStage}>TBD</div>
                ) : (
                  stageMatches.map(renderMatchBox)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
