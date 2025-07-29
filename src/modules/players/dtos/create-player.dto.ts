import type { PlayerDto } from 'src/modules/players/dtos/player.dto';

export type CreatePlayerDto = Omit<PlayerDto, 'id' | 'uuid' | 'updatedAt' | 'createdAt'>;
