import { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { TeamDto } from 'src/modules/teams/dtos/team.dto';
import type { CreateTeamDto } from 'src/modules/teams/dtos/create-team.dto';
import type { UpdateTeamDto } from 'src/modules/teams/dtos/update-team.dto';

export class TeamMapper {
  static fromDto(dto: TeamDto): Team {
    return new Team({
      id: dto.id,
      uuid: dto.uuid,
      slug: dto.slug,
      name: dto.name,
      abbr: dto.abbr,
      logoUrl: dto.logoUrl,
      city: dto.city,
      country: dto.country,
      foundationYear: dto.foundationYear,
      venue: dto.venue,
      leagueId: dto.leagueId,
      referenceId: dto.referenceId,
      referenceUrl: dto.referenceUrl,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  /**
   * Maps a Team entity to a TeamDTO
   * @param team - Team entity
   * @returns TeamDTO object
   */
  static toDto(team: Team): TeamDto {
    return {
      id: team.id,
      uuid: team.uuid,
      slug: team.slug,
      name: team.name,
      abbr: team.abbr,
      logoUrl: team.logoUrl,
      city: team.city,
      country: team.country,
      foundationYear: team.foundationYear,
      venue: team.venue,
      leagueId: team.leagueId,
      referenceId: team.referenceId,
      referenceUrl: team.referenceUrl,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    };
  }

  static fromDtos(dtos: TeamDto[]): Team[] {
    return dtos.map((dto) => TeamMapper.fromDto(dto));
  }

  static toDtos(teams: Team[]): TeamDto[] {
    return teams.map((team) => TeamMapper.toDto(team));
  }

  static toCreateDto(team: Team): CreateTeamDto {
    return {
      slug: team.slug || '',
      name: team.name,
      abbr: team.abbr || null,
      logoUrl: team.logoUrl || null,
      city: team.city,
      country: team.country,
      foundationYear: team.foundationYear || null,
      venue: team.venue || null,
      leagueId: team.leagueId || null,
      referenceId: team.referenceId || null,
      referenceUrl: team.referenceUrl || null,
    };
  }

  /**
   * Maps a Team entity to an UpdateTeamDTO
   * @param team - Team entity
   * @returns UpdateTeamDTO object
   */
  static toUpdateDto(team: Team): UpdateTeamDto {
    const updateDto: UpdateTeamDto = {};

    if (team.slug) updateDto.slug = team.slug;
    if (team.name) updateDto.name = team.name;
    if (team.abbr !== null) updateDto.abbr = team.abbr;
    if (team.logoUrl !== null) updateDto.logoUrl = team.logoUrl;
    if (team.city) updateDto.city = team.city;
    if (team.country) updateDto.country = team.country;
    if (team.foundationYear !== null) updateDto.foundationYear = team.foundationYear;
    if (team.venue !== null) updateDto.venue = team.venue;
    if (team.leagueId !== null) updateDto.leagueId = team.leagueId;
    if (team.referenceId !== null) updateDto.referenceId = team.referenceId;
    if (team.referenceUrl !== null) updateDto.referenceUrl = team.referenceUrl;

    return updateDto;
  }
}

export default TeamMapper;
