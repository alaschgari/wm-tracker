'use client';

import React from 'react';
import { Match, Team } from '../types';
import styles from './MatchCard.module.css';

interface MatchCardProps {
  match: Match;
  teams: Team[];
  lang?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  teams,
  lang = 'de'
}) => {
  const getTeamInfo = (teamId: string): { name: string; flag: string } => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      return { name: team.name, flag: team.flag };
    }
    return { name: teamId, flag: '🏳️' };
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
    }) + timeSuffix;
  };

  const hasPenalties = match.finished && match.homePenaltyScore !== undefined && match.homePenaltyScore !== null;

  return (
    <div className={`glass-panel ${styles.card}`}>
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
        <div className={styles.teamRow}>
          <div className={styles.teamInfo}>
            <span className={styles.flag}>{homeTeamInfo.flag}</span>
            <span>{homeTeamInfo.name}</span>
          </div>
          <div className={styles.scoreDisplay}>
            {match.homeScore !== null ? match.homeScore : '-'}
          </div>
        </div>

        {/* Auswärtsteam */}
        <div className={styles.teamRow}>
          <div className={styles.teamInfo}>
            <span className={styles.flag}>{awayTeamInfo.flag}</span>
            <span>{awayTeamInfo.name}</span>
          </div>
          <div className={styles.scoreDisplay}>
            {match.awayScore !== null ? match.awayScore : '-'}
          </div>
        </div>

        {/* Elfmeterschießen (falls stattgefunden) */}
        {hasPenalties && (
          <div className={styles.penaltyContainer} style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
            <span>i.E. {match.homePenaltyScore}:{match.awayPenaltyScore}</span>
          </div>
        )}
      </div>

      <div className={styles.footer} style={{ justifyContent: 'flex-start' }}>
        <span className={styles.dateText}>{formatDate(match.date)}</span>
      </div>
    </div>
  );
};
