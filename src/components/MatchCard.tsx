'use client';

import React from 'react';
import { Match, Team } from '../types';
import styles from './MatchCard.module.css';

interface MatchCardProps {
  match: Match;
  teams: Team[];
  onScoreChange: (
    matchId: number,
    homeScore: number | null,
    awayScore: number | null,
    homePenaltyScore?: number | null,
    awayPenaltyScore?: number | null,
    finished?: boolean
  ) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, teams, onScoreChange }) => {
  const getTeamInfo = (teamId: string): { name: string; flag: string } => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      return { name: team.name, flag: team.flag };
    }
    // Falls es ein Platzhalter ist (K.o.-Phase)
    return { name: teamId, flag: '🏳️' };
  };

  const homeTeamInfo = getTeamInfo(match.homeTeam);
  const awayTeamInfo = getTeamInfo(match.awayTeam);

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val === null || !isNaN(val)) {
      onScoreChange(
        match.id,
        val,
        match.awayScore,
        match.homePenaltyScore,
        match.awayPenaltyScore,
        val !== null && match.awayScore !== null
      );
    }
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val === null || !isNaN(val)) {
      onScoreChange(
        match.id,
        match.homeScore,
        val,
        match.homePenaltyScore,
        match.awayPenaltyScore,
        match.homeScore !== null && val !== null
      );
    }
  };

  const handleHomePenaltyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val === null || !isNaN(val)) {
      onScoreChange(
        match.id,
        match.homeScore,
        match.awayScore,
        val,
        match.awayPenaltyScore,
        match.finished
      );
    }
  };

  const handleAwayPenaltyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val === null || !isNaN(val)) {
      onScoreChange(
        match.id,
        match.homeScore,
        match.awayScore,
        match.homePenaltyScore,
        val,
        match.finished
      );
    }
  };

  const toggleFinished = () => {
    const nextFinishedState = !match.finished;
    // Setze Scores auf 0, wenn abgeschlossen wird und sie null sind
    const homeScore = match.homeScore === null ? 0 : match.homeScore;
    const awayScore = match.awayScore === null ? 0 : match.awayScore;
    onScoreChange(
      match.id,
      homeScore,
      awayScore,
      match.homePenaltyScore,
      match.awayPenaltyScore,
      nextFinishedState
    );
  };

  // K.o.-Spiele benötigen bei Unentschieden ein Elfmeterschießen
  const showPenaltyInput =
    match.stage !== 'GROUP' &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore === match.awayScore;

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' Uhr';
  };

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.stageBadge}>{match.stage.replace('_', ' ')}</span>
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
          <input
            type="number"
            min="0"
            className={styles.scoreInput}
            value={match.homeScore !== null ? match.homeScore : ''}
            onChange={handleHomeScoreChange}
            placeholder="-"
          />
        </div>

        {/* Auswärtsteam */}
        <div className={styles.teamRow}>
          <div className={styles.teamInfo}>
            <span className={styles.flag}>{awayTeamInfo.flag}</span>
            <span>{awayTeamInfo.name}</span>
          </div>
          <input
            type="number"
            min="0"
            className={styles.scoreInput}
            value={match.awayScore !== null ? match.awayScore : ''}
            onChange={handleAwayScoreChange}
            placeholder="-"
          />
        </div>

        {/* Elfmeterschießen (nur K.o.-Runde & Unentschieden) */}
        {showPenaltyInput && (
          <div className={styles.penaltyContainer}>
            <span>Elfmeter:</span>
            <input
              type="number"
              min="0"
              className={`${styles.scoreInput} ${styles.penaltyInput}`}
              value={match.homePenaltyScore !== null && match.homePenaltyScore !== undefined ? match.homePenaltyScore : ''}
              onChange={handleHomePenaltyChange}
              placeholder="-"
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              className={`${styles.scoreInput} ${styles.penaltyInput}`}
              value={match.awayPenaltyScore !== null && match.awayPenaltyScore !== undefined ? match.awayPenaltyScore : ''}
              onChange={handleAwayPenaltyChange}
              placeholder="-"
            />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.dateText}>{formatDate(match.date)}</span>
        <button
          onClick={toggleFinished}
          className={`${styles.actionButton} ${match.finished ? styles.actionButtonActive : ''}`}
        >
          {match.finished ? 'Gespeichert ✓' : 'Abschließen'}
        </button>
      </div>
    </div>
  );
};
