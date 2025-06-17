export interface CreateTeamByScrapingDto {
  abbr?: string;
  city: string;
  country: string;
  foundationYear?: number;
  leagueId: number;
  leagueUuid: string;
  logoUrl?: string;
  name: string;
  slug: string;
  venue?: string;
  [property: string]: any;
}
