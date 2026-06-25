import { Team, Match, GroupStanding, Stage } from '../types';
import { TEAMS } from '../data/initialData';

interface OpenLigaTeam {
  teamId: number;
  teamName: string;
  shortName: string;
  teamIconUrl?: string;
}

interface OpenLigaResult {
  resultId: number;
  resultName: string;
  pointsTeam1: number;
  pointsTeam2: number;
}

interface OpenLigaLocation {
  stadiumName?: string;
  city?: string;
}

interface OpenLigaMatch {
  matchID: number;
  matchDateTime: string;
  matchDateTimeUTC?: string;
  group?: {
    groupName: string;
    groupID: number;
  };
  team1: OpenLigaTeam | null;
  team2: OpenLigaTeam | null;
  matchResults?: OpenLigaResult[];
  matchIsFinished: boolean;
  location?: OpenLigaLocation;
}


export const calculateStandings = (matches: Match[], teams: Team[]): Record<string, GroupStanding[]> => {
  const standings: Record<string, GroupStanding[]> = {};

  // Initialisiere Tabellen für alle Teams
  teams.forEach((team) => {
    if (!standings[team.group]) {
      standings[team.group] = [];
    }
    standings[team.group].push({
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Nur Gruppenspiele auswerten
  const groupMatches = matches.filter((m) => m.stage === 'GROUP');

  groupMatches.forEach((match) => {
    const { homeTeam, awayTeam, homeScore, awayScore, finished } = match;
    if (!finished || homeScore === null || awayScore === null) return;

    const homeTeamObj = teams.find((t) => t.id === homeTeam);
    const awayTeamObj = teams.find((t) => t.id === awayTeam);

    if (!homeTeamObj || !awayTeamObj) return;

    const homeStanding = standings[homeTeamObj.group]?.find((s) => s.teamId === homeTeam);
    const awayStanding = standings[awayTeamObj.group]?.find((s) => s.teamId === awayTeam);

    if (!homeStanding || !awayStanding) return;

    homeStanding.played += 1;
    awayStanding.played += 1;

    homeStanding.goalsFor += homeScore;
    homeStanding.goalsAgainst += awayScore;
    awayStanding.goalsFor += awayScore;
    awayStanding.goalsAgainst += homeScore;

    homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
    awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;

    if (homeScore > awayScore) {
      homeStanding.won += 1;
      homeStanding.points += 3;
      awayStanding.lost += 1;
    } else if (homeScore < awayScore) {
      awayStanding.won += 1;
      awayStanding.points += 3;
      homeStanding.lost += 1;
    } else {
      homeStanding.drawn += 1;
      homeStanding.points += 1;
      awayStanding.drawn += 1;
      awayStanding.points += 1;
    }
  });

  // Sortiere jede Gruppe nach Punkten, Tordifferenz, erzielten Toren
  Object.keys(standings).forEach((groupName) => {
    standings[groupName].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  });

  return standings;
};

export const updateKnockoutMatches = (matches: Match[], teams: Team[]): Match[] => {
  const updated = [...matches];
  
  // Wenn nur Gruppenspiele geladen wurden (z.B. 72 Spiele von der API),
  // generieren wir die Platzhalter für die K.o.-Phase dynamically.
  if (updated.length < 104) {
    const knockoutStartDate = new Date('2026-06-28T18:00:00Z');
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

    let matchId = 73;

    // Runde der 32 (Spiele 73-88)
    for (let i = 0; i < 16; i++) {
      const matchDate = new Date(knockoutStartDate.getTime());
      matchDate.setDate(knockoutStartDate.getDate() + Math.floor(i / 4));
      matchDate.setHours(17 + (i % 2) * 3);
      const stadiumInfo = STADIAS[i % STADIAS.length];
      updated.push({
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

    // Achtelfinale (Spiele 89-96)
    const r16StartDate = new Date('2026-07-04T18:00:00Z');
    for (let i = 0; i < 8; i++) {
      const matchDate = new Date(r16StartDate.getTime());
      matchDate.setDate(r16StartDate.getDate() + Math.floor(i / 2));
      matchDate.setHours(17 + (i % 2) * 3);
      const stadiumInfo = STADIAS[(i + 4) % STADIAS.length];
      updated.push({
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

    // Viertelfinale (Spiele 97-100)
    const qfStartDate = new Date('2026-07-09T18:00:00Z');
    for (let i = 0; i < 4; i++) {
      const matchDate = new Date(qfStartDate.getTime());
      matchDate.setDate(qfStartDate.getDate() + Math.floor(i / 2));
      matchDate.setHours(17 + (i % 2) * 3);
      const stadiumInfo = STADIAS[(i + 8) % STADIAS.length];
      updated.push({
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

    // Halbfinale (Spiele 101-102)
    const sfStartDate = new Date('2026-07-14T18:00:00Z');
    for (let i = 0; i < 2; i++) {
      const matchDate = new Date(sfStartDate.getTime());
      matchDate.setDate(sfStartDate.getDate() + i);
      matchDate.setHours(20);
      const stadiumInfo = STADIAS[i % STADIAS.length];
      updated.push({
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

    // Spiel um Platz 3 (Spiel 103)
    const thirdPlaceDate = new Date('2026-07-18T20:00:00Z');
    updated.push({
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

    // Finale (Spiel 104)
    const finalDate = new Date('2026-07-19T20:00:00Z');
    updated.push({
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
  }

  const standings = calculateStandings(updated, teams);

  // 1. Runde der 32 (Spiele 73-88, Indizes 72-87)
  // Wir ordnen die Teams basierend auf der Gruppenplatzierung zu.
  // Da die echten Zuweisungen extrem komplex sind, nutzen wir ein stabiles, deterministisches Schema:
  // Spiel 73: 1A vs 3C/D/E/F, Spiel 74: 2A vs 2B, etc.
  const getTeamByRank = (group: string, rank: number): string => {
    const groupStandings = standings[group];
    if (!groupStandings || groupStandings.length < rank) return `Platz ${rank} Gruppe ${group}`;
    const team = teams.find((t) => t.id === groupStandings[rank - 1].teamId);
    return team ? team.id : `Platz ${rank} Gruppe ${group}`;
  };

  // Finde die besten Gruppendritten (12 Gruppen, wir brauchen die Top 8)
  const allThirds: { teamId: string; group: string; points: number; goalDifference: number; goalsFor: number }[] = [];
  Object.entries(standings).forEach(([groupName, groupStandings]) => {
    if (groupStandings.length >= 3) {
      const third = groupStandings[2];
      allThirds.push({
        teamId: third.teamId,
        group: groupName,
        points: third.points,
        goalDifference: third.goalDifference,
        goalsFor: third.goalsFor
      });
    }
  });
  allThirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const topThirds = allThirds.slice(0, 8);
  const getThirdTeam = (index: number): string => {
    if (index >= topThirds.length) return `Bester Dritter #${index + 1}`;
    return topThirds[index].teamId;
  };

  // R32 Paarungen (Matches 73 bis 88, index 72 bis 87)
  const r32Mappings = [
    { home: () => getTeamByRank('A', 1), away: () => getThirdTeam(0) }, // Spiel 73
    { home: () => getTeamByRank('B', 1), away: () => getThirdTeam(1) }, // Spiel 74
    { home: () => getTeamByRank('C', 1), away: () => getThirdTeam(2) }, // Spiel 75
    { home: () => getTeamByRank('D', 1), away: () => getThirdTeam(3) }, // ...
    { home: () => getTeamByRank('E', 1), away: () => getThirdTeam(4) },
    { home: () => getTeamByRank('F', 1), away: () => getThirdTeam(5) },
    { home: () => getTeamByRank('G', 1), away: () => getThirdTeam(6) },
    { home: () => getTeamByRank('H', 1), away: () => getThirdTeam(7) },
    { home: () => getTeamByRank('I', 1), away: () => getTeamByRank('J', 2) },
    { home: () => getTeamByRank('K', 1), away: () => getTeamByRank('L', 2) },
    { home: () => getTeamByRank('A', 2), away: () => getTeamByRank('B', 2) },
    { home: () => getTeamByRank('C', 2), away: () => getTeamByRank('D', 2) },
    { home: () => getTeamByRank('E', 2), away: () => getTeamByRank('F', 2) },
    { home: () => getTeamByRank('G', 2), away: () => getTeamByRank('H', 2) },
    { home: () => getTeamByRank('I', 2), away: () => getTeamByRank('K', 2) },
    { home: () => getTeamByRank('J', 1), away: () => getTeamByRank('L', 1) }, // Spiel 88
  ];

  for (let i = 0; i < 16; i++) {
    const match = updated[72 + i];
    if (match) {
      match.homeTeam = r32Mappings[i].home();
      match.awayTeam = r32Mappings[i].away();
    }
  }

  // Hilfsfunktion zum Bestimmen des Siegers eines K.o.-Spiels
  const getWinnerOfMatch = (matchId: number): string => {
    const match = updated.find((m) => m.id === matchId);
    if (!match || !match.finished || match.homeScore === null || match.awayScore === null) {
      return `Sieger Spiel ${matchId}`;
    }
    if (match.homeScore > match.awayScore) return match.homeTeam;
    if (match.homeScore < match.awayScore) return match.awayTeam;
    // Elfmeterschießen
    if (match.homePenaltyScore !== undefined && match.homePenaltyScore !== null && match.awayPenaltyScore !== undefined && match.awayPenaltyScore !== null) {
      if (match.homePenaltyScore > match.awayPenaltyScore) return match.homeTeam;
      if (match.homePenaltyScore < match.awayPenaltyScore) return match.awayTeam;
    }
    return `Sieger Spiel ${matchId}`;
  };

  const getLoserOfMatch = (matchId: number): string => {
    const match = updated.find((m) => m.id === matchId);
    if (!match || !match.finished || match.homeScore === null || match.awayScore === null) {
      return `Verlierer Spiel ${matchId}`;
    }
    if (match.homeScore > match.awayScore) return match.awayTeam;
    if (match.homeScore < match.awayScore) return match.homeTeam;
    if (match.homePenaltyScore !== undefined && match.homePenaltyScore !== null && match.awayPenaltyScore !== undefined && match.awayPenaltyScore !== null) {
      if (match.homePenaltyScore > match.awayPenaltyScore) return match.awayTeam;
      if (match.homePenaltyScore < match.awayPenaltyScore) return match.homeTeam;
    }
    return `Verlierer Spiel ${matchId}`;
  };

  // 2. Achtelfinale (Spiele 89-96, Indizes 88-95)
  // AF 1: Sieger 73 vs Sieger 74
  // ...
  for (let i = 0; i < 8; i++) {
    const match = updated[88 + i];
    if (match) {
      match.homeTeam = getWinnerOfMatch(73 + i * 2);
      match.awayTeam = getWinnerOfMatch(74 + i * 2);
    }
  }

  // 3. Viertelfinale (Spiele 97-100, Indizes 96-99)
  for (let i = 0; i < 4; i++) {
    const match = updated[96 + i];
    if (match) {
      match.homeTeam = getWinnerOfMatch(89 + i * 2);
      match.awayTeam = getWinnerOfMatch(90 + i * 2);
    }
  }

  // 4. Halbfinale (Spiele 101-102, Indizes 100-101)
  for (let i = 0; i < 2; i++) {
    const match = updated[100 + i];
    if (match) {
      match.homeTeam = getWinnerOfMatch(97 + i * 2);
      match.awayTeam = getWinnerOfMatch(98 + i * 2);
    }
  }

  // 5. Spiel um Platz 3 (Spiel 103, Index 102)
  const thirdPlaceMatch = updated[102];
  if (thirdPlaceMatch) {
    thirdPlaceMatch.homeTeam = getLoserOfMatch(101);
    thirdPlaceMatch.awayTeam = getLoserOfMatch(102);
  }

  // 6. Finale (Spiel 104, Index 103)
  const finalMatch = updated[103];
  if (finalMatch) {
    finalMatch.homeTeam = getWinnerOfMatch(101);
    finalMatch.awayTeam = getWinnerOfMatch(102);
  }

  return updated;
};

const EMOJI_MAP: Record<string, string> = {
  MEX: '🇲🇽', KOR: '🇰🇷', EGY: '🇪🇬', DZA: '🇩🇿', ARG: '🇦🇷', AUS: '🇦🇺',
  BEL: '🇧🇪', BIH: '🇧🇦', BRA: '🇧🇷', CUW: '🇨🇼', DEU: '🇩🇪', GER: '🇩🇪',
  COD: '🇨🇩', ECU: '🇪🇨', CIV: '🇨🇮', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', FRA: '🇫🇷', GHA: '🇬🇭',
  HTI: '🇭🇹', IRQ: '🇮🇶', IRN: '🇮🇷', JPN: '🇯🇵', JOR: '🇯🇴', CAN: '🇨🇦',
  CPV: '🇨🇻', QAT: '🇶🇦', COL: '🇨🇴', HRV: '🇭🇷', MAR: '🇲🇦', NZL: '🇳🇿',
  NLD: '🇳🇱', NOR: '🇳🇴', AUT: '🇦🇹', PAN: '🇵🇦', PAR: '🇵🇾', PRT: '🇵🇹',
  SAU: '🇸🇦', KSA: '🇸🇦', SCT: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', SWE: '🇸🇪', CHE: '🇨🇭', SUI: '🇨🇭',
  SEN: '🇸🇳', ESP: '🇪🇸', TUN: '🇹🇳', TUR: '🇹🇷', URY: '🇺🇾', USA: '🇺🇸',
  UZB: '🇺🇿', CZE: '🇨🇿', RSA: '🇿🇦', ROU: '🇷🇴', SVK: '🇸🇰', UKR: '🇺🇦',
  GEO: '🇬🇪', SVN: '🇸🇮', SRB: '🇷🇸', ALB: '🇦🇱', HUN: '🇭🇺', CMR: '🇨🇲',
  ITA: '🇮🇹', NGA: '🇳🇬', POL: '🇵🇱', JAM: '🇯🇲'
};

const OFFICIAL_GROUPS: Record<string, string> = {
  MEX: 'A', KOR: 'A', CZE: 'A', RSA: 'A',
  CAN: 'B', BIH: 'B', QAT: 'B', CHE: 'B',
  BRA: 'C', MAR: 'C', HTI: 'C', SCT: 'C',
  USA: 'D', PAR: 'D', AUS: 'D', TUR: 'D',
  CUW: 'E', DEU: 'E', ECU: 'E', CIV: 'E',
  JPN: 'F', NLD: 'F', SWE: 'F', TUN: 'F',
  BEL: 'G', EGY: 'G', IRN: 'G', NZL: 'G',
  CPV: 'H', SAU: 'H', ESP: 'H', URY: 'H',
  FRA: 'I', SEN: 'I', IRQ: 'I', NOR: 'I',
  ARG: 'J', DZA: 'J', JOR: 'J', AUT: 'J',
  PRT: 'K', UZB: 'K', COL: 'K', COD: 'K',
  ENG: 'L', GHA: 'L', PAN: 'L', HRV: 'L'
};

export const fetchLiveMatches = async (): Promise<{ matches: Match[]; teams: Team[] }> => {
  try {
    const res = await fetch('https://api.openligadb.de/getmatchdata/wm26/2026', {
      next: { revalidate: 60 } // Next.js native Cache Revalidation (60 Sekunden)
    });
    if (!res.ok) throw new Error('Fehler beim Laden der API');
    
    const apiMatches = (await res.json()) as OpenLigaMatch[];
    if (!Array.isArray(apiMatches)) return { matches: [], teams: [] };

    // Erstelle Team-Liste basierend auf echten Gruppen
    const teamsMap: Record<string, Team> = {};
    apiMatches.forEach((m: OpenLigaMatch) => {
      const processTeam = (t: OpenLigaTeam | null) => {
        if (!t) return;
        const id = t.shortName || t.teamName;
        if (OFFICIAL_GROUPS[id] && !teamsMap[id]) {
          teamsMap[id] = {
            id,
            name: t.teamName,
            flag: EMOJI_MAP[id] || '🏳️',
            group: OFFICIAL_GROUPS[id]
          };
        }
      };
      processTeam(m.team1);
      processTeam(m.team2);
    });

    const dynamicTeams = Object.values(teamsMap);

    const matches = apiMatches.map((m: OpenLigaMatch, index: number) => {
      // Sicheres Parsen der Team-IDs/Namen
      const homeTeam = m.team1 ? (m.team1.shortName || m.team1.teamName) : `TBD (Heim)`;
      const awayTeam = m.team2 ? (m.team2.shortName || m.team2.teamName) : `TBD (Gast)`;

      // Ermittle die Stage (präzise Zuordnung für verschiedene Sprachen und Kurzformen)
      const groupName = m.group?.groupName || '';
      let stage: Stage = 'GROUP';
      const normalizedGroup = groupName.toLowerCase();
      if (
        normalizedGroup.includes('runde der 32') || 
        normalizedGroup.includes('sechzehntelfinale') || 
        normalizedGroup.includes('1/16') ||
        normalizedGroup.includes('round of 32')
      ) {
        stage = 'ROUND_OF_32';
      } else if (
        normalizedGroup.includes('achtelfinale') || 
        normalizedGroup.includes('1/8') ||
        normalizedGroup.includes('round of 16')
      ) {
        stage = 'ROUND_OF_16';
      } else if (
        normalizedGroup.includes('viertelfinale') || 
        normalizedGroup.includes('1/4') ||
        normalizedGroup.includes('quarter')
      ) {
        stage = 'QUARTER_FINALS';
      } else if (
        normalizedGroup.includes('halbfinale') || 
        normalizedGroup.includes('1/2') ||
        normalizedGroup.includes('semi')
      ) {
        stage = 'SEMI_FINALS';
      } else if (
        normalizedGroup.includes('platz 3') || 
        normalizedGroup.includes('dritter') || 
        normalizedGroup.includes('third')
      ) {
        stage = 'THIRD_PLACE';
      } else if (
        normalizedGroup.includes('finale') || 
        normalizedGroup.includes('endspiel') ||
        normalizedGroup.includes('final')
      ) {
        stage = 'FINAL';
      }

      // Ermittle die Gruppe basierend auf OFFICIAL_GROUPS
      const group = stage === 'GROUP' ? (OFFICIAL_GROUPS[homeTeam] || OFFICIAL_GROUPS[awayTeam]) : undefined;

      // Wenn die Klassifizierung GROUP ergab, aber keines der Teams in OFFICIAL_GROUPS liegt,
      // handelt es sich wahrscheinlich um ein K.o.-Spiel mit Platzhaltern (z. B. "Sieger Spiel X").
      // Das ordnen wir der K.o.-Phase zu, um das Leak in die Gruppenphase zu verhindern.
      if (stage === 'GROUP' && !group) {
        stage = 'ROUND_OF_32';
      }

      // Extrahiere Tore (auch für laufende Spiele ohne matchIsFinished-Flag)
      let homeScore: number | null = null;
      let awayScore: number | null = null;
      let homePenaltyScore: number | undefined;
      let awayPenaltyScore: number | undefined;

      if (m.matchResults && m.matchResults.length > 0) {
        const finalResult = m.matchResults.find((r: OpenLigaResult) => 
          r.resultName === 'Endergebnis' || 
          r.resultName === 'Ergebnis nach Verlängerung' || 
          r.resultName === 'Ergebnis nach Elfmeterschießen'
        ) || m.matchResults[m.matchResults.length - 1];

        if (finalResult) {
          homeScore = finalResult.pointsTeam1;
          awayScore = finalResult.pointsTeam2;
        }

        const penaltyResult = m.matchResults.find((r: OpenLigaResult) => r.resultName === 'Ergebnis nach Elfmeterschießen');
        if (penaltyResult) {
          homePenaltyScore = penaltyResult.pointsTeam1;
          awayPenaltyScore = penaltyResult.pointsTeam2;
        }
      }

      const fallbackStadias = [
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
      const fallbackStadium = fallbackStadias[index % fallbackStadias.length];

      return {
        id: index + 1,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        homePenaltyScore,
        awayPenaltyScore,
        date: m.matchDateTimeUTC || m.matchDateTime,
        stage,
        group,
        stadium: m.location?.stadiumName || fallbackStadium.stadium,
        city: m.location?.city || fallbackStadium.city,
        finished: m.matchIsFinished
      };
    });

    return { matches, teams: dynamicTeams };
  } catch (error) {
    console.error('Failed to fetch live matches, falling back to initial data:', error);
    try {
      const { generateInitialMatches } = await import('../data/initialData');
      return { matches: generateInitialMatches(), teams: TEAMS };
    } catch (importError) {
      console.error('Fallback failed too:', importError);
      return { matches: [], teams: TEAMS };
    }
  }
};


export const fetchLiveMatchesFromApi = async (): Promise<{ matches: Match[]; teams: Team[] }> => {
  const res = await fetch('/api/matches');
  if (!res.ok) throw new Error('Fehler beim Laden des Proxies');
  return res.json();
};


