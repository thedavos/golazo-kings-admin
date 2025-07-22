export enum PlayerPosition {
  GOALKEEPER = 'goalkeeper',
  DEFENDER = 'defender',
  MIDFIELDER = 'midfielder',
  FORWARD = 'forward',
}

export enum PlayerPositionAbbreviation {
  GK = 'GK', // Goalkeeper
  DEF = 'DEF', // Defender
  MID = 'MID', // Midfielder
  FWD = 'FWD', // Forward
}

export const PlayerPositionLabels: Record<PlayerPosition, string> = {
  [PlayerPosition.GOALKEEPER]: 'Portero',
  [PlayerPosition.DEFENDER]: 'Defensa',
  [PlayerPosition.MIDFIELDER]: 'Centrocampista',
  [PlayerPosition.FORWARD]: 'Delantero',
};

export const PlayerPositionAbbreviationLabels: Record<PlayerPositionAbbreviation, string> = {
  [PlayerPositionAbbreviation.GK]: 'POR',
  [PlayerPositionAbbreviation.DEF]: 'DEF',
  [PlayerPositionAbbreviation.MID]: 'MED',
  [PlayerPositionAbbreviation.FWD]: 'DEL',
};
