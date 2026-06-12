export type Stage =
  | 'GROUP'
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINALS'
  | 'SEMI_FINALS'
  | 'THIRD_PLACE'
  | 'FINAL';

export interface Team {
  id: string; // e.g., "USA"
  name: string;
  flag: string; // Emoji flag or code
  group: string; // e.g., "A"
}

export interface Match {
  id: number;
  homeTeam: string; // Team ID or placeholder (e.g. "1A", "3A/B/C/D")
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  date: string; // ISO String or Date
  stage: Stage;
  group?: string; // Group name if stage is 'GROUP'
  stadium?: string;
  city?: string;
  finished: boolean;
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Group {
  name: string; // A - L
  teams: Team[];
}
