export interface ScrapedPlayerRequestDto {
  region?: number | undefined;
  season?: number | undefined;
  split?: number | undefined;
  referenceTeamId: number;
  referenceTeamUrl: string;
  isQueensLeague: boolean;
}
