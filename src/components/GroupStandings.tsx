import { GroupStanding, Team } from '../types';
import styles from './GroupStandings.module.css';
import { TEAM_TRANSLATIONS, TRANSLATIONS, Language } from '../data/translations';

interface GroupStandingsProps {
  standings: Record<string, GroupStanding[]>;
  teams: Team[];
  lang?: Language;
  favorites?: string[];
  toggleFavorite?: (teamId: string) => void;
  onTeamClick?: (teamId: string) => void;
}

export const GroupStandings: React.FC<GroupStandingsProps> = ({
  standings,
  teams,
  lang = 'de',
  favorites = [],
  toggleFavorite,
  onTeamClick
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;

  const getTeamInfo = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const name = TEAM_TRANSLATIONS[team.id]?.[lang] || team.name;
      return { id: team.id, name, flag: team.flag };
    }
    return { id: teamId, name: teamId, flag: '🏳️' };
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
          <div className={styles.groupTitle}>{t.group} {groupName}</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.teamLabel}</th>
                <th>{t.playedLabel}</th>
                <th>{t.diffLabel}</th>
                <th>{t.pointsLabel}</th>
              </tr>
            </thead>

            <tbody>
              {standings[groupName].map((row, idx) => {
                const team = getTeamInfo(row.teamId);
                const qualifyClass = getQualifyClass(idx);
                const isLeader = idx === 0;
                const isFavorite = favorites.includes(row.teamId);

                return (
                  <tr key={row.teamId} className={`${styles.teamRow} ${qualifyClass} ${isFavorite ? styles.rowFavorite : ''}`}>
                    <td>
                      <div 
                        className={`${styles.teamNameCell} ${onTeamClick ? styles.clickableTeam : ''}`}
                        onClick={() => onTeamClick && onTeamClick(row.teamId)}
                      >
                        <span className={styles.rank}>{idx + 1}</span>
                        {toggleFavorite && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(row.teamId);
                            }}
                            className={`${styles.starBtn} ${isFavorite ? styles.starActive : ''}`}
                            title={lang === 'en' ? 'Toggle favorite country' : lang === 'es' ? 'Marcar/desmarcar país favorito' : lang === 'fr' ? 'Ajouter/retirer favori' : lang === 'ru' ? 'Добавить/удалить любимую страну' : lang === 'uk' ? 'Додати/видалити улюблену країну' : 'Lieblingsland markieren/entfernen'}
                          >
                            {isFavorite ? '★' : '☆'}
                          </button>
                        )}
                        <span className={styles.flag}>{team.flag}</span>
                        <span title={team.name} className={isFavorite ? styles.favTeamName : ''}>{team.id}</span>
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
