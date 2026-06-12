import React from 'react';
import { GroupStanding, Team } from '../types';
import styles from './GroupStandings.module.css';

interface GroupStandingsProps {
  standings: Record<string, GroupStanding[]>;
  teams: Team[];
  teamLabel?: string;
  playedLabel?: string;
  diffLabel?: string;
  pointsLabel?: string;
  groupLabel?: string;
}

export const GroupStandings: React.FC<GroupStandingsProps> = ({
  standings,
  teams,
  teamLabel = 'Team',
  playedLabel = 'Sp',
  diffLabel = 'TD',
  pointsLabel = 'Pkt',
  groupLabel = 'Gruppe'
}) => {
  const getTeamInfo = (teamId: string) => {
    return teams.find((t) => t.id === teamId) || { id: teamId, name: teamId, flag: '🏳️' };
  };

  const getQualifyClass = (index: number) => {
    if (index < 2) return styles.qualifyDirect; // Top 2 weiter
    if (index === 2) return styles.qualifyThird; // Dritter hat Hoffnungen
    return styles.eliminate; // Vierter ausgeschieden
  };

  // Sortierte Gruppen nach Namen
  const sortedGroups = Object.keys(standings).sort();

  return (
    <div className={styles.grid}>
      {sortedGroups.map((groupName) => (
        <div key={groupName} className={`glass-panel ${styles.groupCard}`}>
          <div className={styles.groupTitle}>{groupLabel} {groupName}</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{teamLabel}</th>
                <th>{playedLabel}</th>
                <th>{diffLabel}</th>
                <th>{pointsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {standings[groupName].map((row, idx) => {
                const team = getTeamInfo(row.teamId);
                const qualifyClass = getQualifyClass(idx);
                const isLeader = idx === 0;

                return (
                  <tr key={row.teamId} className={`${styles.teamRow} ${qualifyClass}`}>
                    <td>
                      <div className={styles.teamNameCell}>
                        <span className={styles.rank}>{idx + 1}</span>
                        <span className={styles.flag}>{team.flag}</span>
                        <span title={team.name}>{team.id}</span>
                      </div>
                    </td>
                    <td>{row.played}</td>
                    <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                    <td className={`${styles.points} ${isLeader ? styles.pointsGlow : ''}`}>
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
