'use client';

import React from 'react';
import { Match, Team } from '../types';
import { TRANSLATIONS, TEAM_TRANSLATIONS, Language } from '../data/translations';
import { exportToIcs } from '../services/calendarHelper';
import styles from './MatchCard.module.css';

interface MatchCardProps {
  match: Match;
  teams: Team[];
  lang?: string;
  timezone?: string;
  favorites?: string[];
  toggleFavorite?: (teamId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teams,
  lang = 'de',
  timezone = 'Europe/Berlin',
  favorites = [],
  toggleFavorite
}) => {
  const getTeamInfo = (teamId: string): { name: string; flag: string } => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const translatedName = TEAM_TRANSLATIONS[team.id]?.[lang as Language] || team.name;
      return { name: translatedName, flag: team.flag };
    }
    
    // Fallback/Translate placeholder text like "Sieger Spiel X" or "Verlierer HF 1"
    let displayPlaceholder = teamId;
    if (lang !== 'de') {
      displayPlaceholder = teamId
        .replace('Sieger Spiel', lang === 'en' ? 'Winner Match' : lang === 'es' ? 'Ganador Partido' : lang === 'fr' ? 'Vainqueur Match' : lang === 'ru' ? 'Победитель Матча' : 'Переможець Матчу')
        .replace('Sieger AF', lang === 'en' ? 'Winner R16' : lang === 'es' ? 'Ganador Octavos' : lang === 'fr' ? 'Vainqueur Huitièmes' : lang === 'ru' ? 'Победитель 1/8' : 'Переможець 1/8')
        .replace('Sieger VF', lang === 'en' ? 'Winner QF' : lang === 'es' ? 'Ganador Cuartos' : lang === 'fr' ? 'Vainqueur Quarts' : lang === 'ru' ? 'Победитель 1/4' : 'Переможець 1/4')
        .replace('Sieger HF', lang === 'en' ? 'Winner SF' : lang === 'es' ? 'Ganador Semis' : lang === 'fr' ? 'Vainqueur Demis' : lang === 'ru' ? 'Победитель 1/2' : 'Переможець 1/2')
        .replace('Verlierer Halbfinale', lang === 'en' ? 'Loser Semi-final' : lang === 'es' ? 'Perdedor Semifinal' : lang === 'fr' ? 'Perdant Demi-finale' : lang === 'ru' ? 'Проигравший 1/2' : 'Той, хто програв 1/2')
        .replace('Sieger Halbfinale', lang === 'en' ? 'Winner Semi-final' : lang === 'es' ? 'Ganador Semifinal' : lang === 'fr' ? 'Vainqueur Demi-finale' : lang === 'ru' ? 'Победитель 1/2' : 'Переможець 1/2')
        .replace('Zweiter Spiel', lang === 'en' ? 'Runner-up Match' : lang === 'es' ? 'Segundo Partido' : lang === 'fr' ? 'Deuxième Match' : lang === 'ru' ? 'Второе Место Матча' : 'Друге Місце Матчу')
        .replace('(Platzhalter)', lang === 'en' ? '(Placeholder)' : lang === 'es' ? '(Marcador)' : lang === 'fr' ? '(Position)' : lang === 'ru' ? '(Заглушка)' : '(Заглушка)');
    }
    
    return { name: displayPlaceholder, flag: '🏳️' };
  };

  const homeTeamInfo = getTeamInfo(match.homeTeam);
  const awayTeamInfo = getTeamInfo(match.awayTeam);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'de-DE';
    const timeSuffix = lang === 'en' ? '' : lang === 'fr' ? ' h' : lang === 'es' ? ' h' : ' Uhr';
    return d.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    }) + timeSuffix;
  };

  const hasPenalties = match.finished && match.homePenaltyScore !== undefined && match.homePenaltyScore !== null;
  const isHomeFav = favorites.includes(match.homeTeam);
  const isAwayFav = favorites.includes(match.awayTeam);
  const isAnyFav = isHomeFav || isAwayFav;
  const favTooltip = TRANSLATIONS[lang as Language]?.favoriteTooltip || 'Favorite';

  const isPlaceholder = (teamId: string) => {
    return !teamId || teamId.startsWith('W') || teamId.startsWith('RU') || teamId.includes(' ') || teamId.length > 3;
  };

  const renderTeamFlag = (teamId: string, defaultFlag: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team?.iconUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={team.iconUrl} alt="" className={styles.teamIcon} />;
    }
    return <span className={styles.flag}>{defaultFlag}</span>;
  };

  return (
    <div className={`glass-panel ${styles.card} ${isAnyFav ? styles.cardFavorite : ''}`}>
      <div className={styles.header}>
        <span className={styles.stageBadge}>
          {match.stage === 'GROUP' && match.group
            ? (lang === 'en' ? `Group ${match.group}` : lang === 'es' ? `Grupo ${match.group}` : lang === 'fr' ? `Groupe ${match.group}` : lang === 'ru' ? `Группа ${match.group}` : lang === 'uk' ? `Група ${match.group}` : `Gruppe ${match.group}`)
            : match.stage.replace(/_/g, ' ')}
        </span>
        <span className={styles.venue} title={`${match.stadium}, ${match.city}`}>
          {match.city}
        </span>
      </div>

      <div className={styles.teamsContainer}>
        {/* Heimteam */}
        <div className={`${styles.teamRow} ${isHomeFav ? styles.rowFavorite : ''}`}>
          <div className={styles.teamInfo}>
            {!isPlaceholder(match.homeTeam) && toggleFavorite && (
              <button
                type="button"
                onClick={() => toggleFavorite(match.homeTeam)}
                className={`${styles.starBtn} ${isHomeFav ? styles.starActive : ''}`}
                title={favTooltip}
              >
                {isHomeFav ? '★' : '☆'}
              </button>
            )}
            {renderTeamFlag(match.homeTeam, homeTeamInfo.flag)}
            <span className={isHomeFav ? styles.favTeamName : ''}>{homeTeamInfo.name}</span>
          </div>
          <div className={styles.scoreDisplay}>
            {match.homeScore !== null ? match.homeScore : '-'}
          </div>
        </div>

        {/* Auswärtsteam */}
        <div className={`${styles.teamRow} ${isAwayFav ? styles.rowFavorite : ''}`}>
          <div className={styles.teamInfo}>
            {!isPlaceholder(match.awayTeam) && toggleFavorite && (
              <button
                type="button"
                onClick={() => toggleFavorite(match.awayTeam)}
                className={`${styles.starBtn} ${isAwayFav ? styles.starActive : ''}`}
                title={favTooltip}
              >
                {isAwayFav ? '★' : '☆'}
              </button>
            )}
            {renderTeamFlag(match.awayTeam, awayTeamInfo.flag)}
            <span className={isAwayFav ? styles.favTeamName : ''}>{awayTeamInfo.name}</span>
          </div>
          <div className={styles.scoreDisplay}>
            {match.awayScore !== null ? match.awayScore : '-'}
          </div>
        </div>

        {/* Halbzeitergebnis */}
        {match.halfTimeScore && match.homeScore !== null && (
          <div className={styles.halfTimeContainer}>
            <span>{lang === 'en' ? 'HT' : lang === 'es' ? 'Desc.' : lang === 'fr' ? 'MT' : 'Halbzeit'} {match.halfTimeScore.home}:{match.halfTimeScore.away}</span>
          </div>
        )}

        {/* Elfmeterschießen (falls stattgefunden) */}
        {hasPenalties && (
          <div className={styles.penaltyContainer} style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            <span>i.E. {match.homePenaltyScore}:{match.awayPenaltyScore}</span>
          </div>
        )}

        {/* Torschützenliste */}
        {match.goals && match.goals.length > 0 && (
          <div className={styles.goalsList}>
            {match.goals.map((goal) => (
              <div key={goal.id} className={styles.goalItem}>
                <span className={styles.goalIcon}>⚽</span>
                <span className={styles.goalMinute}>{goal.minute}&apos;</span>
                <span className={styles.goalScorer} title={goal.scorer}>
                  {goal.scorer}
                  {goal.isPenalty && ` (${lang === 'en' ? 'Pen.' : 'Elfmeter'})`}
                  {goal.isOwnGoal && ` (${lang === 'en' ? 'OG' : 'Eigentor'})`}
                </span>
                <span className={styles.goalScore}>({goal.scoreHome}:{goal.scoreAway})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer} style={{ justifyContent: 'space-between', width: '100%' }}>
        <span className={styles.dateText}>{formatDate(match.date)}</span>
        <button 
          onClick={() => {
            const stageDisplay = match.stage === 'GROUP' && match.group
              ? (lang === 'en' ? `Group ${match.group}` : lang === 'es' ? `Grupo ${match.group}` : lang === 'fr' ? `Groupe ${match.group}` : lang === 'ru' ? `Группа ${match.group}` : lang === 'uk' ? `Група ${match.group}` : `Gruppe ${match.group}`)
              : match.stage.replace(/_/g, ' ');
            exportToIcs(match, homeTeamInfo.name, awayTeamInfo.name, stageDisplay);
          }}
          className={styles.calendarExportBtn}
          title={lang === 'en' ? 'Add to Calendar' : lang === 'es' ? 'Añadir al calendario' : lang === 'fr' ? 'Ajouter au calendrier' : lang === 'ru' ? 'Добавить в календарь' : lang === 'uk' ? 'Додати до календаря' : 'In den Kalender eintragen'}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            transition: 'var(--transition-smooth)'
          }}
        >
          📅
        </button>
      </div>
    </div>
  );
};
