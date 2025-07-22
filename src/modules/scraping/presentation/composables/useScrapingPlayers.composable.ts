import { ref } from 'vue';
import { ScrapingService } from 'src/modules/scraping/services/scraping.service';
// import { PlayerService } from 'src/modules/players/services/player.service';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { ScrapingOptions } from 'src/modules/scraping/presentation/composables/useScraping.composable';
import type {
  PlayerScrapingResult,
  ScrapingResult,
} from 'src/modules/scraping/dtos/scrapingResult.dto';

export function useScrapingPlayers() {
  const scrapingService = new ScrapingService();
  // const playerService = new PlayerService();

  // reactive state
  const scrapingPlayerLoading = ref(false);
  const scrapingHistory = ref<ScrapingResult[]>([]);

  async function scrapePlayersByTeam(selectedTeam: Team, options: ScrapingOptions) {
    const startTime = Date.now();
    scrapingPlayerLoading.value = true;

    try {
      const scrapedPlayers = await scrapingService.getScrapedPlayers({
        referenceTeamId: selectedTeam.referenceId!,
        referenceTeamUrl: selectedTeam.referenceUrl!,
        isQueensLeague: false,
      });

      const filteredPlayers = options.nameFilter
        ? scrapedPlayers.filter((player) =>
            player?.name?.toLowerCase().includes(options.nameFilter!.toLowerCase()),
          )
        : scrapedPlayers;

      const duration = Date.now() - startTime;

      const fullResult: PlayerScrapingResult = {
        success: true,
        type: ScrapingType.PLAYERS,
        itemsScraped: filteredPlayers.length,
        itemsCreated: 0,
        itemsUpdated: 0,
        errors: [],
        scrapedItems: filteredPlayers,
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
