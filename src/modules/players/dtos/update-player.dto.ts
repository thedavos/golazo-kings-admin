import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';

export type UpdatePlayerDto = Partial<CreatePlayerDto>;
