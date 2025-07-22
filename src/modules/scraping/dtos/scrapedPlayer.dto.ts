export interface ScrapedPlayerDto {
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number;
  isWildCard: boolean;
  imageUrl: string;
  referenceId: number | null;
  referenceUrl: string | null;
}
