import { ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { ScrapingService } from 'src/modules/scraping/services/scraping.service';
import { PlayerService } from 'src/modules/players/services/player.service';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { ScrapingOptions } from 'src/modules/scraping/presentation/composables/useScraping.composable';
import type {
  PlayerScrapingResult,
  ScrapingResult,
} from 'src/modules/scraping/dtos/scrapingResult.dto';
import PlayerMapper from 'src/modules/players/mappers/player.mapper';
import { tryCatch } from 'src/modules/shared/utils/tryCatch.util';
import { objectComparer } from 'src/modules/shared/utils/objectComparer.util';
import type { TryCatchResult } from 'src/modules/shared/utils/tryCatch.util';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import type { ScrapedPlayer } from 'src/modules/scraping/domain/entities/scrapedPlayer.entity';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';
import { PositionMapper } from 'src/modules/players/mappers/player-position.mapper';

export function useScrapingPlayers() {
  const notifications = useQuasarNotifications();
  const scrapingService = new ScrapingService();
  const playerService = new PlayerService();

  // reactive state
  const scrapingPlayerLoading = ref(false);
  const scrapingHistory = ref<ScrapingResult[]>([]);

  async function getPlayerByScrapedPlayer(
    scrapedPlayer: ScrapedPlayer,
  ): Promise<TryCatchResult<Player>> {
    return tryCatch(() => playerService.getPlayerBySlug(scrapedPlayer.slug));
  }

  async function createMissingPlayer(
    scrapedPlayer: ScrapedPlayer,
    team: Team,
  ): Promise<TryCatchResult<Player>> {
    const mappedPosition = PositionMapper.mapPosition(scrapedPlayer.position);
    const mappedPositionAbbreviation = PositionMapper.mapPositionTextToAbbreviation(
      scrapedPlayer.position,
    );

    const createPlayerDto: CreatePlayerDto = {
      firstName: scrapedPlayer.firstName!,
      lastName: scrapedPlayer.lastName!,
      isWildCard: scrapedPlayer.isWildCard!,
      slug: scrapedPlayer.slug,
      jerseyNumber: scrapedPlayer.jerseyNumber,
      profileImageUrl: scrapedPlayer.imageUrl,
      position: mappedPosition,
      positionAbbreviation: mappedPositionAbbreviation,
      referenceId: scrapedPlayer.referenceId,
      referenceUrl: scrapedPlayer.referenceUrl,
      teamId: team.id,
      teamUuid: team.uuid,
    };

    return tryCatch(() => scrapingService.createPlayerByScraping(createPlayerDto));
  }

  async function updateExistingPlayer(
    existingPlayer: Player,
    team: Team,
  ): Promise<TryCatchResult<Player>> {
    const updatedPlayerDto = PlayerMapper.toUpdateDto(existingPlayer);
    updatedPlayerDto.teamId = team.id;
    updatedPlayerDto.teamUuid = team.uuid;
    return tryCatch(() =>
      playerService.updatePlayer(existingPlayer.id, existingPlayer.uuid, updatedPlayerDto),
    );
  }

  async function processScrapedPlayers(
    scrapedPlayers: ScrapedPlayer[],
    team: Team,
    options: ScrapingOptions,
  ) {
    const result = {
      success: true,
      itemsScraped: scrapedPlayers.length,
      itemsCreated: 0,
      itemsUpdated: 0,
      errors: [] as string[],
      scrapedItems: scrapedPlayers,
    };

    if (!options.createMissing && !options.updateExisting) {
      result.success = true;
      return result;
    }

    const processingPromises = scrapedPlayers.map(async (scrapedPlayer: ScrapedPlayer) => {
      const { data: existingPlayer } = await getPlayerByScrapedPlayer(scrapedPlayer);

      if (existingPlayer) {
        const { hasChanges } = objectComparer.compare<object>(existingPlayer, scrapedPlayer);

        if (options.updateExisting && hasChanges) {
          const { error: updatePlayerErrorMessage } = await updateExistingPlayer(
            existingPlayer,
            team,
          );

          if (updatePlayerErrorMessage) {
            return {
              status: 'error',
              error: `Error actualizando a ${scrapedPlayer.name}: ${updatePlayerErrorMessage}`,
            };
          }

          return { status: 'updated' };
        }

        return { status: 'skipped' };
      } else {
        if (options.createMissing) {
          const { error: createPlayerErrorMessage } = await createMissingPlayer(
            scrapedPlayer,
            team,
          );

          if (createPlayerErrorMessage) {
            return {
              status: 'error',
              error: `Error creando a ${scrapedPlayer.name}: ${createPlayerErrorMessage}`,
            };
          }

          return { status: 'created' };
        }
      }

      return { status: 'skipped' };
    });

    const outputs = await Promise.all(processingPromises);

    for (const output of outputs) {
      if (output.status === 'created') result.itemsCreated++;
      if (output.status === 'updated') result.itemsUpdated++;
      if (output.status === 'error') result.errors.push(output.error!);
    }

    result.success = result.errors.length === 0;

    notifications.notifyInfo('Proceso terminado');

    return result;
  }

  async function scrapePlayersByTeam(selectedTeam: Team, options: ScrapingOptions) {
    const startTime = Date.now();
    scrapingPlayerLoading.value = true;

    try {
      const scrapedPlayers = await scrapingService.getScrapedPlayers({
        referenceTeamId: selectedTeam.referenceId!,
        referenceTeamUrl: selectedTeam.referenceUrl!,
        isQueensLeague: options.isQueensLeague,
      });

      const filteredPlayers = options.nameFilter
        ? scrapedPlayers.filter((player) =>
            player?.name?.toLowerCase().includes(options.nameFilter!.toLowerCase()),
          )
        : scrapedPlayers;

      const result = await processScrapedPlayers(filteredPlayers, selectedTeam, options);
      const duration = Date.now() - startTime;

      const fullResult: PlayerScrapingResult = {
        ...result,
        success: true,
        type: ScrapingType.PLAYERS,
        timestamp: new Date(),
        duration,
        details: {
          teamName: selectedTeam.slug,
        },
      };

      scrapingHistory.value.unshift(fullResult);

      return fullResult;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorResult: PlayerScrapingResult = {
        success: false,
        type: ScrapingType.PLAYERS,
        itemsScraped: 0,
        itemsCreated: 0,
        itemsUpdated: 0,
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
        scrapedItems: [],
        timestamp: new Date(),
        duration,
        details: {
          teamName: selectedTeam.slug,
        },
      };

      scrapingHistory.value.unshift(errorResult);

      throw error;
    } finally {
      scrapingPlayerLoading.value = false;
    }
  }

  return {
    scrapePlayersByTeam,
  };
}
