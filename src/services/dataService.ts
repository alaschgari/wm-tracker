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

interface OpenLigaGoal {
  goalID: number;
  scoreTeam1: number;
  scoreTeam2: number;
  matchMinute: number;
  goalGetterName: string;
  isPenalty: boolean;
  isOwnGoal: boolean;
  isOvertime: boolean;
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
  goals?: OpenLigaGoal[];
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
  return [...matches].sort((a, b) => a.id - b.id);
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

const normalizeTeamId = (id: string): string => {
  const mapping: Record<string, string> = {
    GER: 'DEU',
    SUI: 'CHE',
    KSA: 'SAU',
    ALG: 'DZA',
    SCO: 'SCT',
    NED: 'NLD',
    IRI: 'IRN',
    URU: 'URY',
    POR: 'PRT',
    CRO: 'HRV',
  };
  return mapping[id] || id;
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
        const rawId = t.shortName || t.teamName;
        const id = normalizeTeamId(rawId);
        if (OFFICIAL_GROUPS[id] && !teamsMap[id]) {
          teamsMap[id] = {
            id,
            name: t.teamName,
            flag: EMOJI_MAP[id] || '🏳️',
            group: OFFICIAL_GROUPS[id],
            iconUrl: t.teamIconUrl || undefined
          };
        }
      };
      processTeam(m.team1);
      processTeam(m.team2);
    });

    const dynamicTeams = Object.values(teamsMap);

    const matches = apiMatches.map((m: OpenLigaMatch, index: number) => {
      // Sicheres Parsen und Normalisieren der Team-IDs/Namen
      const homeRaw = m.team1 ? (m.team1.shortName || m.team1.teamName) : `TBD (Heim)`;
      const awayRaw = m.team2 ? (m.team2.shortName || m.team2.teamName) : `TBD (Gast)`;
      const homeTeam = normalizeTeamId(homeRaw);
      const awayTeam = normalizeTeamId(awayRaw);

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

      let halfTimeScore: { home: number; away: number } | null = null;
      if (m.matchResults && m.matchResults.length > 0) {
        const htResult = m.matchResults.find((r: OpenLigaResult) => r.resultName === 'Halbzeitergebnis');
        if (htResult) {
          halfTimeScore = {
            home: htResult.pointsTeam1,
            away: htResult.pointsTeam2
          };
        }
      }

      const apiGoals = m.goals ? [...m.goals].sort((a, b) => a.matchMinute - b.matchMinute) : [];
      let prevHomeScore = 0;
      const goals = apiGoals.map((g: OpenLigaGoal) => {
        const isHome = g.scoreTeam1 > prevHomeScore;
        prevHomeScore = g.scoreTeam1;
        return {
          id: g.goalID,
          scoreHome: g.scoreTeam1,
          scoreAway: g.scoreTeam2,
          minute: g.matchMinute,
          scorer: g.goalGetterName || 'Unbekannt',
          isPenalty: g.isPenalty,
          isOwnGoal: g.isOwnGoal,
          isHome
        };
      });

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
        halfTimeScore,
        goals,
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

export interface TopScorer {
  name: string;
  teamId: string;
  goals: number;
}

export const calculateTopScorers = (matches: Match[]): TopScorer[] => {
  const scorerMap: Record<string, { goals: number; teamId: string }> = {};

  matches.forEach((match) => {
    if (!match.goals) return;

    match.goals.forEach((goal) => {
      if (goal.isOwnGoal) return;

      const scorerName = goal.scorer.trim();
      if (!scorerName || scorerName === 'Unbekannt') return;

      const teamId = goal.isHome ? match.homeTeam : match.awayTeam;

      if (!scorerMap[scorerName]) {
        scorerMap[scorerName] = { goals: 0, teamId };
      }
      scorerMap[scorerName].goals += 1;
    });
  });

  return Object.entries(scorerMap)
    .map(([name, data]) => ({
      name,
      teamId: data.teamId,
      goals: data.goals
    }))
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
};

export interface TeamScorerStats {
  teamId: string;
  totalGoals: number;
  scorers: { name: string; goals: number }[];
}

export const calculateTeamStats = (matches: Match[]): TeamScorerStats[] => {
  const teamMap: Record<string, { totalGoals: number; scorers: Record<string, number> }> = {};

  matches.forEach((match) => {
    if (!match.goals) return;

    match.goals.forEach((goal) => {
      if (goal.isOwnGoal) return;

      const scorerName = goal.scorer.trim();
      if (!scorerName || scorerName === 'Unbekannt') return;

      const teamId = goal.isHome ? match.homeTeam : match.awayTeam;

      if (!teamMap[teamId]) {
        teamMap[teamId] = { totalGoals: 0, scorers: {} };
      }

      teamMap[teamId].totalGoals += 1;
      teamMap[teamId].scorers[scorerName] = (teamMap[teamId].scorers[scorerName] || 0) + 1;
    });
  });

  return Object.entries(teamMap)
    .map(([teamId, data]) => {
      const sortedScorers = Object.entries(data.scorers)
        .map(([name, goals]) => ({ name, goals }))
        .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
        .slice(0, 5);

      return {
        teamId,
        totalGoals: data.totalGoals,
        scorers: sortedScorers
      };
    })
    .sort((a, b) => b.totalGoals - a.totalGoals || a.teamId.localeCompare(b.teamId));
};

export interface FastestGoal {
  scorer: string;
  teamId: string;
  minute: number;
  matchId: number;
  opponentId: string;
}

export interface LateGoal {
  scorer: string;
  teamId: string;
  minute: number;
  matchId: number;
  opponentId: string;
  scoreAfter: string;
}

export interface HighestScoringMatch {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  totalGoals: number;
  stage: string;
}

export interface BiggestWin {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  difference: number;
  winnerId: string;
  stage: string;
}

export interface CleanSheetStats {
  teamId: string;
  cleanSheets: number;
  played: number;
}

export interface GroupGoals {
  group: string;
  goals: number;
}

export const calculateAllStats = (matches: Match[]) => {
  const fastestGoals: FastestGoal[] = [];
  const lateGoals: LateGoal[] = [];
  
  let totalPenalties = 0;
  let totalOwnGoals = 0;
  const ownGoalsMap: Record<string, number> = {};
  const penaltiesMap: Record<string, number> = {};

  const cleanSheetsMap: Record<string, { cleanSheets: number; played: number }> = {};
  const groupGoalsMap: Record<string, number> = {};
  const highestScoringMatches: HighestScoringMatch[] = [];
  const biggestWins: BiggestWin[] = [];

  matches.forEach((m) => {
    if (m.finished && m.homeScore !== null && m.awayScore !== null) {
      if (!cleanSheetsMap[m.homeTeam]) cleanSheetsMap[m.homeTeam] = { cleanSheets: 0, played: 0 };
      cleanSheetsMap[m.homeTeam].played += 1;
      if (m.awayScore === 0) cleanSheetsMap[m.homeTeam].cleanSheets += 1;

      if (!cleanSheetsMap[m.awayTeam]) cleanSheetsMap[m.awayTeam] = { cleanSheets: 0, played: 0 };
      cleanSheetsMap[m.awayTeam].played += 1;
      if (m.homeScore === 0) cleanSheetsMap[m.awayTeam].cleanSheets += 1;

      const totalGoals = m.homeScore + m.awayScore;
      highestScoringMatches.push({
        matchId: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        totalGoals,
        stage: m.stage
      });

      const difference = Math.abs(m.homeScore - m.awayScore);
      if (difference > 0) {
        biggestWins.push({
          matchId: m.id,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          difference,
          winnerId: m.homeScore > m.awayScore ? m.homeTeam : m.awayTeam,
          stage: m.stage
        });
      }
    }

    if (m.goals && m.goals.length > 0) {
      m.goals.forEach((g) => {
        const teamId = g.isHome ? m.homeTeam : m.awayTeam;
        const opponentId = g.isHome ? m.awayTeam : m.homeTeam;

        if (m.stage === 'GROUP' && m.group) {
          groupGoalsMap[m.group] = (groupGoalsMap[m.group] || 0) + 1;
        }

        if (g.minute <= 15 && !g.isOwnGoal) {
          fastestGoals.push({
            scorer: g.scorer,
            teamId,
            minute: g.minute,
            matchId: m.id,
            opponentId
          });
        }

        if (g.minute >= 85 && !g.isOwnGoal) {
          lateGoals.push({
            scorer: g.scorer,
            teamId,
            minute: g.minute,
            matchId: m.id,
            opponentId,
            scoreAfter: `${g.scoreHome}:${g.scoreAway}`
          });
        }

        if (g.isPenalty) {
          totalPenalties += 1;
          penaltiesMap[teamId] = (penaltiesMap[teamId] || 0) + 1;
        }

        if (g.isOwnGoal) {
          totalOwnGoals += 1;
          ownGoalsMap[opponentId] = (ownGoalsMap[opponentId] || 0) + 1;
        }
      });
    }
  });

  const sortedFastestGoals = fastestGoals.sort((a, b) => a.minute - b.minute).slice(0, 10);
  const sortedLateGoals = lateGoals.sort((a, b) => b.minute - a.minute).slice(0, 10);

  const teamsWithMostOwnGoals = Object.entries(ownGoalsMap)
    .map(([teamId, count]) => ({ teamId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const teamsWithMostPenalties = Object.entries(penaltiesMap)
    .map(([teamId, count]) => ({ teamId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const cleanSheets = Object.entries(cleanSheetsMap)
    .map(([teamId, data]) => ({ teamId, cleanSheets: data.cleanSheets, played: data.played }))
    .filter(t => t.cleanSheets > 0)
    .sort((a, b) => b.cleanSheets - a.cleanSheets || b.cleanSheets/b.played - a.cleanSheets/a.played)
    .slice(0, 10);

  const groupGoals = Object.entries(groupGoalsMap)
    .map(([group, goals]) => ({ group, goals }))
    .sort((a, b) => b.goals - a.goals);

  const sortedHighestScoring = highestScoringMatches
    .sort((a, b) => b.totalGoals - a.totalGoals)
    .slice(0, 8);

  const sortedBiggestWins = biggestWins
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 8);

  return {
    fastestGoals: sortedFastestGoals,
    lateGoals: sortedLateGoals,
    penaltiesOwnGoals: {
      totalPenalties,
      totalOwnGoals,
      teamsWithMostOwnGoals,
      teamsWithMostPenalties
    },
    cleanSheets,
    groupGoals,
    highestScoringMatches: sortedHighestScoring,
    biggestWins: sortedBiggestWins
  };
};
