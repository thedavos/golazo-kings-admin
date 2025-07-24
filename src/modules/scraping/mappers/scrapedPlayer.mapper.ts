import { ScrapedPlayer } from 'src/modules/scraping/domain/entities/scrapedPlayer.entity';
import type { ScrapedPlayerDto } from 'src/modules/scraping/dtos/scrapedPlayer.dto';

export class ScrapedPlayerMapper {
  static fromDto(dto: ScrapedPlayerDto): ScrapedPlayer {
    return new ScrapedPlayer({
      name: dto.name,
      firstName: dto.firstName,
      lastName: dto.lastName,
      slug: dto.slug,
      imageUrl: dto.imageUrl,
      isWildCard: dto.isWildCard,
      jerseyNumber: dto.jerseyNumber,
      position: dto.position,
      referenceId: dto.referenceId,
      referenceUrl: dto.referenceUrl,
    });
  }

  static fromDtos(dtos: ScrapedPlayerDto[]): ScrapedPlayer[] {
    return dtos.map((dto) => this.fromDto(dto));
  }

  static toDto(scrapedPlayer: ScrapedPlayer): ScrapedPlayerDto {
    return {
      name: scrapedPlayer.name!,
      firstName: scrapedPlayer.firstName!,
      lastName: scrapedPlayer.lastName!,
      slug: scrapedPlayer.slug,
      imageUrl: scrapedPlayer.imageUrl!,
      isWildCard: scrapedPlayer.isWildCard!,
      jerseyNumber: scrapedPlayer.jerseyNumber!,
      position: scrapedPlayer.position!,
      referenceId: scrapedPlayer.referenceId,
      referenceUrl: scrapedPlayer.referenceUrl,
    };
  }

  static toDtos(scrapedPlayers: ScrapedPlayer[]): ScrapedPlayerDto[] {
    return scrapedPlayers.map((scrapedPlayer) => this.toDto(scrapedPlayer));
  }
}
