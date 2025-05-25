import type { LeagueDto } from 'src/modules/leagues/dtos/league.dto';

export type CreateLeagueDto = Omit<
  LeagueDto,
  'id' | 'uuid' | 'updatedAt' | 'createdAt' | 'seasons'
>;
