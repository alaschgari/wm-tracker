import { Team, Match, Stage } from '../types';

export const TEAMS: Team[] = [
  // Gruppe A
  { id: 'MEX', name: 'Mexiko', flag: '🇲🇽', group: 'A' },
  { id: 'CAN', name: 'Kanada', flag: '🇨🇦', group: 'A' },
  { id: 'USA', name: 'USA', flag: '🇺🇸', group: 'A' },
  { id: 'CRC', name: 'Costa Rica', flag: '🇨🇷', group: 'A' },
  // Gruppe B
  { id: 'ARG', name: 'Argentinien', flag: '🇦🇷', group: 'B' },
  { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'B' },
  { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'B' },
  { id: 'JAM', name: 'Jamaika', flag: '🇯🇲', group: 'B' },
  // Gruppe C
  { id: 'BRA', name: 'Brasilien', flag: '🇧🇷', group: 'C' },
  { id: 'COL', name: 'Kolumbien', flag: '🇨🇴', group: 'C' },
  { id: 'VEN', name: 'Venezuela', flag: '🇻🇪', group: 'C' },
  { id: 'BOL', name: 'Bolivien', flag: '🇧🇴', group: 'C' },
  // Gruppe D
  { id: 'FRA', name: 'Frankreich', flag: '🇫🇷', group: 'D' },
  { id: 'AUT', name: 'Österreich', flag: '🇦🇹', group: 'D' },
  { id: 'POL', name: 'Polen', flag: '🇵🇱', group: 'D' },
  { id: 'TUN', name: 'Tunesien', flag: '🇹🇳', group: 'D' },
  // Gruppe E
  { id: 'BEL', name: 'Belgien', flag: '🇧🇪', group: 'E' },
  { id: 'SVK', name: 'Slowakei', flag: '🇸🇰', group: 'E' },
  { id: 'ROU', name: 'Rumänien', flag: '🇷🇴', group: 'E' },
  { id: 'UKR', name: 'Ukraine', flag: '🇺🇦', group: 'E' },
  // Gruppe F
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'F' },
  { id: 'TUR', name: 'Türkei', flag: '🇹🇷', group: 'F' },
  { id: 'CZE', name: 'Tschechien', flag: '🇨🇿', group: 'F' },
  { id: 'GEO', name: 'Georgien', flag: '🇬🇪', group: 'F' },
  // Gruppe G
  { id: 'ESP', name: 'Spanien', flag: '🇪🇸', group: 'G' },
  { id: 'ITA', name: 'Italien', flag: '🇮🇹', group: 'G' },
  { id: 'CRO', name: 'Kroatien', flag: '🇭🇷', group: 'G' },
  { id: 'ALB', name: 'Albanien', flag: '🇦🇱', group: 'G' },
  // Gruppe H
  { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'H' },
  { id: 'DEN', name: 'Dänemark', flag: '🇩🇰', group: 'H' },
  { id: 'SVN', name: 'Slowenien', flag: '🇸🇮', group: 'H' },
  { id: 'SRB', name: 'Serbien', flag: '🇷🇸', group: 'H' },
  // Gruppe I
  { id: 'GER', name: 'Deutschland', flag: '🇩🇪', group: 'I' },
  { id: 'SUI', name: 'Schweiz', flag: '🇨🇭', group: 'I' },
  { id: 'SCO', name: 'Schottland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'I' },
  { id: 'HUN', name: 'Ungarn', group: 'I', flag: '🇭🇺' },
  // Gruppe J
  { id: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'J' },
  { id: 'MAR', name: 'Marokko', flag: '🇲🇦', group: 'J' },
  { id: 'NGA', name: 'Nigeria', flag: '🇳🇬', group: 'J' },
  { id: 'RSA', name: 'Südafrika', flag: '🇿🇦', group: 'J' },
  // Gruppe K
  { id: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'K' },
  { id: 'KOR', name: 'Südkorea', flag: '🇰🇷', group: 'K' },
  { id: 'AUS', name: 'Australien', flag: '🇦🇺', group: 'K' },
  { id: 'KSA', name: 'Saudi-Arabien', flag: '🇸🇦', group: 'K' },
  // Gruppe L
  { id: 'NZL', name: 'Neuseeland', flag: '🇳🇿', group: 'L' },
  { id: 'JAM_2', name: 'Kamerun', flag: '🇨🇲', group: 'L' }, // renamed to avoid conflict
  { id: 'ALG', name: 'Algerien', flag: '🇩🇿', group: 'L' },
  { id: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'L' }
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
