import type { TeamDto } from 'src/modules/teams/dtos/team.dto';

export type CreateTeamDto = Omit<TeamDto, 'id' | 'uuid' | 'updatedAt' | 'createdAt'>;
