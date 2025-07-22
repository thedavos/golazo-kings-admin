import { Player } from '../domain/entities/player.entity';
import type { PlayerDto } from '../dtos/player.dto';
import type { CreatePlayerDto } from '../dtos/create-player.dto';
import type { UpdatePlayerDto } from '../dtos/update-player.dto';

export class PlayerMapper {
  static fromDto(dto: PlayerDto): Player {
    return new Player({
      id: dto.id,
      uuid: dto.uuid,
      slug: dto.slug,
      firstName: dto.firstName,
      lastName: dto.lastName,
      nickname: dto.nickname,
      height: dto.height,
      weight: dto.weight,
      isActive: dto.isActive,
      marketValue: dto.marketValue,
      profileImageUrl: dto.profileImageUrl,
      position: dto.position,
      positionAbbreviation: dto.positionAbbreviation,
      preferredFoot: dto.preferredFoot,
      jerseyNumber: dto.jerseyNumber,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      nationality: dto.nationality,
      socialMediaHandle: dto.socialMediaHandle,
      isWildCard: dto.isWildCard,
      wildCardType: dto.wildCardType,
      wildCardDescription: dto.wildCardDescription,
      formerTeam: dto.formerTeam,
      referenceId: dto.referenceId,
      referenceUrl: dto.referenceUrl,
      teamId: dto.teamId,
      teamUuid: dto.teamUuid,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    } as Partial<Player>);
  }

  static toDto(player: Player): PlayerDto {
    return {
      id: player.id,
      uuid: player.uuid,
      slug: player.slug,
      firstName: player.firstName,
      lastName: player.lastName,
      nickname: player.nickname,
      height: player.height || null,
      weight: player.weight || null,
      isActive: player.isActive,
      marketValue: player.marketValue || null,
      profileImageUrl: player.profileImageUrl || null,
      position: player.position || null,
      positionAbbreviation: player.positionAbbreviation || null,
      preferredFoot: player.preferredFoot || null,
      jerseyNumber: player.jerseyNumber || null,
      birthDate: player.birthDate ? player.birthDate.toISOString().split('T')[0] : null,
      nationality: player.nationality || null,
      socialMediaHandle: player.socialMediaHandle || null,
      isWildCard: player.isWildCard,
      wildCardType: player.wildCardType || null,
      wildCardDescription: player.wildCardDescription || null,
      formerTeam: player.formerTeam || null,
      referenceId: player.referenceId || null,
      referenceUrl: player.referenceUrl || null,
      teamId: player.teamId,
      teamUuid: player.teamUuid,
      createdAt: player.createdAt!.toISOString(),
      updatedAt: player.updatedAt!.toISOString(),
    };
  }

  static fromDtos(dtos: PlayerDto[]): Player[] {
    return dtos.map((dto) => PlayerMapper.fromDto(dto));
  }

  static toDtos(players: Player[]): PlayerDto[] {
    return players.map((player) => PlayerMapper.toDto(player));
  }

  static toCreateDto(player: Player): CreatePlayerDto {
    return {
      slug: player.slug,
      firstName: player.firstName,
      lastName: player.lastName,
      nickname: player.nickname || null,
      height: player.height || null,
      weight: player.weight || null,
      isActive: player.isActive,
      marketValue: player.marketValue || null,
      profileImageUrl: player.profileImageUrl || null,
      position: player.position || null,
      positionAbbreviation: player.positionAbbreviation || null,
      preferredFoot: player.preferredFoot || null,
      jerseyNumber: player.jerseyNumber || null,
      birthDate: player.birthDate ? player.birthDate.toISOString().split('T')[0] : null,
      nationality: player.nationality || null,
      socialMediaHandle: player.socialMediaHandle || null,
      isWildCard: player.isWildCard,
      wildCardType: player.wildCardType || null,
      wildCardDescription: player.wildCardDescription || null,
      formerTeam: player.formerTeam || null,
      referenceId: player.referenceId || null,
      referenceUrl: player.referenceUrl || null,
      teamId: player.teamId,
      teamUuid: player.teamUuid,
    };
  }

  static toUpdateDto(player: Player): UpdatePlayerDto {
    const updateDto: UpdatePlayerDto = {};

    if (player.slug) updateDto.slug = player.slug;
    if (player.firstName) updateDto.firstName = player.firstName;
    if (player.lastName) updateDto.lastName = player.lastName;
    if (player.nickname !== undefined) updateDto.nickname = player.nickname;
    if (player.height !== undefined) updateDto.height = player.height;
    if (player.weight !== undefined) updateDto.weight = player.weight;
    if (player.isActive !== undefined) updateDto.isActive = player.isActive;
    if (player.marketValue !== undefined) updateDto.marketValue = player.marketValue;
    if (player.profileImageUrl !== undefined) updateDto.profileImageUrl = player.profileImageUrl;
    if (player.position !== undefined) updateDto.position = player.position;
    if (player.positionAbbreviation !== undefined)
      updateDto.positionAbbreviation = player.positionAbbreviation;
    if (player.preferredFoot !== undefined) updateDto.preferredFoot = player.preferredFoot;
    if (player.jerseyNumber !== undefined) updateDto.jerseyNumber = player.jerseyNumber;
    if (player.birthDate !== undefined) {
      updateDto.birthDate = player.birthDate ? player.birthDate.toISOString().split('T')[0] : null;
    }
    if (player.nationality !== undefined) updateDto.nationality = player.nationality;
    if (player.socialMediaHandle !== undefined)
      updateDto.socialMediaHandle = player.socialMediaHandle;
    if (player.isWildCard !== undefined) updateDto.isWildCard = player.isWildCard;
    if (player.wildCardType !== undefined) updateDto.wildCardType = player.wildCardType;
    if (player.wildCardDescription !== undefined)
      updateDto.wildCardDescription = player.wildCardDescription;
    if (player.formerTeam !== undefined) updateDto.formerTeam = player.formerTeam;
    if (player.referenceId !== undefined) updateDto.referenceId = player.referenceId;
    if (player.referenceUrl !== undefined) updateDto.referenceUrl = player.referenceUrl;
    if (player.teamId) updateDto.teamId = player.teamId;
    if (player.teamUuid) updateDto.teamUuid = player.teamUuid;

    return updateDto;
  }
}

export default PlayerMapper;
