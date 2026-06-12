'use client';

import React from 'react';
import { Match, Team } from '../types';
import { TEAM_TRANSLATIONS, Language } from '../data/translations';
import { exportToIcs } from '../services/calendarHelper';
import styles from './TimeMatrix.module.css';

interface TimeMatrixProps {
  matches: Match[];
  teams: Team[];
  lang: string;
  timezone?: string;
  favorites?: string[];
}

export const TimeMatrix: React.FC<TimeMatrixProps> = ({
  matches,
  teams,
  lang = 'de',
  timezone = 'Europe/Berlin',
  favorites = []
}) => {
  const locale = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'de-DE';

  const getTeamInfo = (teamId: string): { name: string; flag: string } => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const translatedName = TEAM_TRANSLATIONS[team.id]?.[lang as Language] || team.name;
      return { name: translatedName, flag: team.flag };
    }
    
    // Fallback/Translate placeholder text
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

  // Hilfsfunktion zum Formatieren des Datums für den Zeilenvergleich
  const getDateKey = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      timeZone: timezone
    });
  };

  // Hilfsfunktion zum Extrahieren der Uhrzeit
  const getTimeKey = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    });
  };

  // Finde alle einzigartigen Termine und Uhrzeiten
  const dateMap: Record<string, number> = {}; // Sortierungsschlüssel
  const uniqueDatesSet = new Set<string>();
  const uniqueTimesSet = new Set<string>();

  matches.forEach((m) => {
    const dateKey = getDateKey(m.date);
    const timeKey = getTimeKey(m.date);
    uniqueDatesSet.add(dateKey);
    uniqueTimesSet.add(timeKey);
    
    // Verwende den zeitzonenangepassten Startzeitpunkt für die Sortierung
    const d = new Date(m.date);
    const timeMs = d.getTime();
    if (!dateMap[dateKey] || timeMs < dateMap[dateKey]) {
      dateMap[dateKey] = timeMs;
    }
  });

  const sortedDates = Array.from(uniqueDatesSet).sort((a, b) => dateMap[a] - dateMap[b]);
  
  // Sortiere Uhrzeiten (z. B. "16:00" vor "21:00", aber beachte 00:00 Uhrzeiten der WM-Nacht)
  const sortedTimes = Array.from(uniqueTimesSet).sort((a, b) => {
    const [hA, mA] = a.split(/[:h]/).map(Number);
    const [hB, mB] = b.split(/[:h]/).map(Number);
    // Sortiere späte/frühe Stunden für europäische Nachtschicht logisch
    const adjustedA = hA < 10 ? hA + 24 : hA;
    const adjustedB = hB < 10 ? hB + 24 : hB;
    return adjustedA - adjustedB;
  });

  // Ordne Spiele nach Datum und Uhrzeit zu
  const gridData: Record<string, Record<string, Match[]>> = {};
  matches.forEach((m) => {
    const dateKey = getDateKey(m.date);
    const timeKey = getTimeKey(m.date);
    if (!gridData[dateKey]) gridData[dateKey] = {};
    if (!gridData[dateKey][timeKey]) gridData[dateKey][timeKey] = [];
    gridData[dateKey][timeKey].push(m);
  });

  return (
    <div className={`glass-panel ${styles.matrixContainer}`}>
      <div className={styles.scrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.stickyColHeader}>{lang === 'en' ? 'Date' : lang === 'es' ? 'Fecha' : lang === 'fr' ? 'Date' : lang === 'ru' ? 'Дата' : lang === 'uk' ? 'Дата' : 'Datum'}</th>
              {sortedTimes.map((timeKey) => (
                <th key={timeKey} className={styles.timeHeader}>
                  {timeKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDates.map((dateKey) => (
              <tr key={dateKey}>
                <td className={styles.stickyRowHeader}>{dateKey}</td>
                {sortedTimes.map((timeKey) => {
                  const cellMatches = gridData[dateKey]?.[timeKey] || [];
                  return (
                    <td key={timeKey} className={styles.matrixCell}>
                      {cellMatches.map((match) => {
                        const home = getTeamInfo(match.homeTeam);
                        const away = getTeamInfo(match.awayTeam);
                        const showScore = match.homeScore !== null && match.awayScore !== null;
                        const isHomeFav = favorites.includes(match.homeTeam);
                        const isAwayFav = favorites.includes(match.awayTeam);
                        const isAnyFav = isHomeFav || isAwayFav;
                        
                        return (
                          <div 
                            key={match.id} 
                            className={`${styles.miniMatchCard} ${isAnyFav ? styles.miniMatchCardFavorite : ''}`}
                            title={`${match.stage.replace('_', ' ')} - ${match.stadium}, ${match.city}`}
                          >
                            <div className={styles.miniCardHeader}>
                              <span className={styles.miniStage}>
                                {match.stage === 'GROUP' ? `${lang === 'en' ? 'Gr.' : lang === 'es' ? 'Gr.' : lang === 'fr' ? 'Gr.' : lang === 'ru' ? 'Гр.' : lang === 'uk' ? 'Гр.' : 'Gr.'} ${match.group}` : match.stage.replace('ROUND_OF_', 'R').replace('QUARTER_FINALS', 'QF').replace('SEMI_FINALS', 'SF').replace('FINAL', 'F')}
                              </span>
                              <button 
                                onClick={() => {
                                  const stageDisplay = match.stage === 'GROUP' && match.group
                                    ? (lang === 'en' ? `Group ${match.group}` : lang === 'es' ? `Grupo ${match.group}` : lang === 'fr' ? `Groupe ${match.group}` : lang === 'ru' ? `Группа ${match.group}` : lang === 'uk' ? `Група ${match.group}` : `Gruppe ${match.group}`)
                                    : match.stage.replace(/_/g, ' ');
                                  exportToIcs(match, home.name, away.name, stageDisplay);
                                }}
                                className={styles.miniCalendarBtn}
                                title={lang === 'en' ? 'Add to Calendar' : lang === 'es' ? 'Añadir al calendario' : lang === 'fr' ? 'Ajouter au calendrier' : lang === 'ru' ? 'Добавить в календарь' : lang === 'uk' ? 'Додати до календаря' : 'In den Kalender eintragen'}
                              >
                                📅
                              </button>
                            </div>
                            <div className={styles.miniTeam}>
                              <span>{home.flag}</span>
                              <span className={`${styles.teamCode} ${isHomeFav ? styles.favTeamCode : ''}`}>{match.homeTeam}</span>
                              {showScore && <span className={styles.miniScore}>{match.homeScore}</span>}
                            </div>
                            <div className={styles.divider}>vs</div>
                            <div className={styles.miniTeam}>
                              <span>{away.flag}</span>
                              <span className={`${styles.teamCode} ${isAwayFav ? styles.favTeamCode : ''}`}>{match.awayTeam}</span>
                              {showScore && <span className={styles.miniScore}>{match.awayScore}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
