export interface TeamDto {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  abbr: string | null;
  logoUrl: string | null;
  city: string;
  country: string;
  foundationYear: number | null;
  venue: string | null;
  leagueId: number | null;
  createdAt: string;
  updatedAt: string;
}
