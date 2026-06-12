import { Team, Match, Stage } from '../types';

export const TEAMS: Team[] = [
  // Gruppe A
  { id: 'CZE', name: 'Tschechien', flag: '🇨🇿', group: 'A' },
  { id: 'KOR', name: 'Südkorea', flag: '🇰🇷', group: 'A' },
  { id: 'MEX', name: 'Mexiko', flag: '🇲🇽', group: 'A' },
  { id: 'RSA', name: 'Südafrika', flag: '🇿🇦', group: 'A' },
  // Gruppe B
  { id: 'BIH', name: 'Bosnien und Herzegowina', flag: '🇧🇦', group: 'B' },
  { id: 'CAN', name: 'Kanada', flag: '🇨🇦', group: 'B' },
  { id: 'CHE', name: 'Schweiz', flag: '🇨🇭', group: 'B' },
  { id: 'QAT', name: 'Katar', flag: '🇶🇦', group: 'B' },
  // Gruppe C
  { id: 'BRA', name: 'Brasilien', flag: '🇧🇷', group: 'C' },
  { id: 'HTI', name: 'Haiti', flag: '🇭🇹', group: 'C' },
  { id: 'MAR', name: 'Marokko', flag: '🇲🇦', group: 'C' },
  { id: 'SCT', name: 'Schottland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  // Gruppe D
  { id: 'AUS', name: 'Australien', flag: '🇦🇺', group: 'D' },
  { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
  { id: 'TUR', name: 'Türkei', flag: '🇹🇷', group: 'D' },
  { id: 'USA', name: 'USA', flag: '🇺🇸', group: 'D' },
  // Gruppe E
  { id: 'CIV', name: 'Elfenbeinküste', flag: '🇨🇮', group: 'E' },
  { id: 'CUW', name: 'Curaçao', flag: '🇨🇼', group: 'E' },
  { id: 'DEU', name: 'Deutschland', flag: '🇩🇪', group: 'E' },
  { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
  // Gruppe F
  { id: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'F' },
  { id: 'NLD', name: 'Niederlande', flag: '🇳🇱', group: 'F' },
  { id: 'SWE', name: 'Schweden', flag: '🇸🇪', group: 'F' },
  { id: 'TUN', name: 'Tunesien', flag: '🇹🇳', group: 'F' },
  // Gruppe G
  { id: 'BEL', name: 'Belgien', flag: '🇧🇪', group: 'G' },
  { id: 'EGY', name: 'Ägypten', flag: '🇪🇬', group: 'G' },
  { id: 'IRN', name: 'Iran', flag: '🇮🇷', group: 'G' },
  { id: 'NZL', name: 'Neuseeland', flag: '🇳🇿', group: 'G' },
  // Gruppe H
  { id: 'CPV', name: 'Kap Verde', flag: '🇨🇻', group: 'H' },
  { id: 'ESP', name: 'Spanien', flag: '🇪🇸', group: 'H' },
  { id: 'SAU', name: 'Saudi Arabien', flag: '🇸🇦', group: 'H' },
  { id: 'URY', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
  // Gruppe I
  { id: 'FRA', name: 'Frankreich', flag: '🇫🇷', group: 'I' },
  { id: 'IRQ', name: 'Irak', flag: '🇮🇶', group: 'I' },
  { id: 'NOR', name: 'Norwegen', flag: '🇳🇴', group: 'I' },
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  // Gruppe J
  { id: 'ARG', name: 'Argentinien', flag: '🇦🇷', group: 'J' },
  { id: 'AUT', name: 'Österreich', flag: '🇦🇹', group: 'J' },
  { id: 'DZA', name: 'Algerien', flag: '🇩🇿', group: 'J' },
  { id: 'JOR', name: 'Jordanien', flag: '🇯🇴', group: 'J' },
  // Gruppe K
  { id: 'COD', name: 'DR Kongo', flag: '🇨🇩', group: 'K' },
  { id: 'COL', name: 'Kolumbien', flag: '🇨🇴', group: 'K' },
  { id: 'PRT', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  { id: 'UZB', name: 'Usbekistan', flag: '🇺🇿', group: 'K' },
  // Gruppe L
  { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { id: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'L' },
  { id: 'HRV', name: 'Kroatien', flag: '🇭🇷', group: 'L' },
  { id: 'PAN', name: 'Panama', flag: '🇵🇦', group: 'L' }
];

const STADIAS = [
  { stadium: 'Azteca', city: 'Mexiko-Stadt' },
  { stadium: 'MetLife Stadium', city: 'New York/New Jersey' },
  { stadium: 'SoFi Stadium', city: 'Los Angeles' },
  { stadium: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { stadium: 'BC Place', city: 'Vancouver' },
  { stadium: 'BMO Field', city: 'Toronto' },
  { stadium: 'Hard Rock Stadium', city: 'Miami' },
  { stadium: 'AT&T Stadium', city: 'Dallas' },
  { stadium: 'Arrowhead Stadium', city: 'Kansas City' },
  { stadium: 'Gillette Stadium', city: 'Boston' },
  { stadium: 'Lincoln Financial Field', city: 'Philadelphia' },
  { stadium: 'Lumen Field', city: 'Seattle' }
];

export const generateInitialMatches = (): Match[] => {
  const matches: Match[] = [];
  let matchId = 1;
  const startDate = new Date('2026-06-11T18:00:00Z');

  // 12 Gruppen A-L
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  groups.forEach((groupChar, groupIndex) => {
    const groupTeams = TEAMS.filter((t) => t.group === groupChar);
    
    // Spielplan für jede 4er Gruppe (Jeder gegen jeden = 6 Spiele)
    // R1: 0-1, 2-3
    // R2: 0-2, 1-3
    // R3: 0-3, 1-2
    const pairings = [
      [0, 1], [2, 3],
      [0, 2], [1, 3],
      [0, 3], [1, 2]
    ];

    pairings.forEach(([p1, p2], idx) => {
      const home = groupTeams[p1];
      const away = groupTeams[p2];

      const matchDate = new Date(startDate.getTime());
      // Verteile Spiele über 15 Tage Gruppenphase
      const dayOffset = groupIndex * 1 + Math.floor(idx / 2);
      matchDate.setDate(startDate.getDate() + dayOffset);
      matchDate.setHours(16 + (idx % 2) * 3); // 16:00 oder 19:00

      const stadiumInfo = STADIAS[(groupIndex + idx) % STADIAS.length];

      matches.push({
        id: matchId++,
        homeTeam: home.id,
        awayTeam: away.id,
        homeScore: null,
        awayScore: null,
        date: matchDate.toISOString(),
        stage: 'GROUP',
        group: groupChar,
        stadium: stadiumInfo.stadium,
        city: stadiumInfo.city,
        finished: false
      });
    });
  });

  // K.o.-Phase Generierung (Runde der letzten 32)
  const r32StartDate = new Date('2026-06-28T18:00:00Z');
  for (let i = 0; i < 16; i++) {
    const matchDate = new Date(r32StartDate.getTime());
    matchDate.setDate(r32StartDate.getDate() + Math.floor(i / 4));
    matchDate.setHours(17 + (i % 2) * 3);
    const stadiumInfo = STADIAS[i % STADIAS.length];

    matches.push({
      id: matchId++,
      homeTeam: `Sieger Spiel ${i * 2 + 1} (Platzhalter)`,
      awayTeam: `Zweiter Spiel ${i * 2 + 2} (Platzhalter)`,
      homeScore: null,
      awayScore: null,
      date: matchDate.toISOString(),
      stage: 'ROUND_OF_32',
      stadium: stadiumInfo.stadium,
      city: stadiumInfo.city,
      finished: false
    });
  }

  // Achtelfinale (Round of 16)
  const r16StartDate = new Date('2026-07-04T18:00:00Z');
  for (let i = 0; i < 8; i++) {
    const matchDate = new Date(r16StartDate.getTime());
    matchDate.setDate(r16StartDate.getDate() + Math.floor(i / 2));
    matchDate.setHours(17 + (i % 2) * 3);
    const stadiumInfo = STADIAS[(i + 4) % STADIAS.length];

    matches.push({
      id: matchId++,
      homeTeam: `Sieger AF ${i * 2 + 1}`,
      awayTeam: `Sieger AF ${i * 2 + 2}`,
      homeScore: null,
      awayScore: null,
      date: matchDate.toISOString(),
      stage: 'ROUND_OF_16',
      stadium: stadiumInfo.stadium,
      city: stadiumInfo.city,
      finished: false
    });
  }

  // Viertelfinale
  const qfStartDate = new Date('2026-07-09T18:00:00Z');
  for (let i = 0; i < 4; i++) {
    const matchDate = new Date(qfStartDate.getTime());
    matchDate.setDate(qfStartDate.getDate() + Math.floor(i / 2));
    matchDate.setHours(17 + (i % 2) * 3);
    const stadiumInfo = STADIAS[(i + 8) % STADIAS.length];

    matches.push({
      id: matchId++,
      homeTeam: `Sieger VF ${i * 2 + 1}`,
      awayTeam: `Sieger VF ${i * 2 + 2}`,
      homeScore: null,
      awayScore: null,
      date: matchDate.toISOString(),
      stage: 'QUARTER_FINALS',
      stadium: stadiumInfo.stadium,
      city: stadiumInfo.city,
      finished: false
    });
  }

  // Halbfinale
  const sfStartDate = new Date('2026-07-14T18:00:00Z');
  for (let i = 0; i < 2; i++) {
    const matchDate = new Date(sfStartDate.getTime());
    matchDate.setDate(sfStartDate.getDate() + i);
    matchDate.setHours(20);
    const stadiumInfo = STADIAS[i % STADIAS.length];

    matches.push({
      id: matchId++,
      homeTeam: `Sieger HF ${i + 1}`,
      awayTeam: `Sieger HF ${i + 2}`,
      homeScore: null,
      awayScore: null,
      date: matchDate.toISOString(),
      stage: 'SEMI_FINALS',
      stadium: stadiumInfo.stadium,
      city: stadiumInfo.city,
      finished: false
    });
  }

  // Spiel um Platz 3
  const thirdPlaceDate = new Date('2026-07-18T20:00:00Z');
  matches.push({
    id: matchId++,
    homeTeam: 'Verlierer Halbfinale 1',
    awayTeam: 'Verlierer Halbfinale 2',
    homeScore: null,
    awayScore: null,
    date: thirdPlaceDate.toISOString(),
    stage: 'THIRD_PLACE',
    stadium: 'Hard Rock Stadium',
    city: 'Miami',
    finished: false
  });

  // Finale
  const finalDate = new Date('2026-07-19T20:00:00Z');
  matches.push({
    id: matchId++,
    homeTeam: 'Sieger Halbfinale 1',
    awayTeam: 'Sieger Halbfinale 2',
    homeScore: null,
    awayScore: null,
    date: finalDate.toISOString(),
    stage: 'FINAL',
    stadium: 'MetLife Stadium',
    city: 'New York/New Jersey',
    finished: false
  });

  return matches;
};
