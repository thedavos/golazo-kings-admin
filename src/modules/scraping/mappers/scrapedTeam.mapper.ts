import { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type { ScrapedTeamDto } from 'src/modules/scraping/dtos/scrapedTeam.dto';

export class ScrapedTeamMapper {
  static fromDto(dto: ScrapedTeamDto): ScrapedTeam {
    return new ScrapedTeam({
      name: dto.name,
      logoUrl: dto.logo,
      slug: dto.slug,
      leagueId: dto.leagueId,
    });
  }

  static fromDtos(dtos: ScrapedTeamDto[]): ScrapedTeam[] {
    return dtos.map((dto) => this.fromDto(dto));
  }

  static toDto(scrapedTeam: ScrapedTeam): ScrapedTeamDto {
    return {
      name: scrapedTeam.name,
      logo: scrapedTeam.logoUrl,
      leagueId: scrapedTeam.leagueId,
      slug: scrapedTeam.slug,
    };
  }

  static toDtos(scrapedTeams: ScrapedTeam[]): ScrapedTeamDto[] {
    return scrapedTeams.map((scrapedTeam) => this.toDto(scrapedTeam));
  }

  // static toCreateTeamDto(scrapedTeam: ScrapedTeam): CreateTeamDto {
  //   return scrapedTeam.toCreateTeamData();
  // }
}
