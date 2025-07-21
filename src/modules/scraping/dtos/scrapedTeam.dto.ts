export interface ScrapedTeamDto {
  name: string;
  logo: string;
  slug: string;
  leagueId: number;
  referenceId: number | null;
  referenceUrl: string | null;
}
