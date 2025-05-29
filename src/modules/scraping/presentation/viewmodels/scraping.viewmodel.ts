import { ref, computed } from 'vue';
import { ScrapingService } from 'src/modules/scraping/services/scraping.service';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type {
  ScrapingResult,
  TeamScrapingResult,
  TeamScrapingProcessResult,
} from 'src/modules/scraping/dtos/scrapingResult.dto';
import type { UseQuasarNotificationReturn } from 'src/composables/useQuasarNotifications';

export interface ScrapingOptions {
  createMissing: boolean;
  updateExisting: boolean;
  preserveManualData: boolean;
  nameFilter?: string;
}

export class ScrapingViewModel {
  private scrapingService: ScrapingService;
  private notifications: UseQuasarNotificationReturn;

  // Reactive state
  private _scrapingLoading = ref(false);
  private _lastScrapingResult = ref<ScrapingResult | null>(null);
  private _scrapingHistory = ref<ScrapingResult[]>([]);

  // Computed properties
  public readonly scrapingLoading = computed(() => this._scrapingLoading.value);
  public readonly lastScrapingResult = computed(() => this._lastScrapingResult.value);
  public readonly scrapingHistory = computed(() => this._scrapingHistory.value);

  constructor(notifications: UseQuasarNotificationReturn) {
    this.scrapingService = new ScrapingService();
    this.notifications = notifications;
  }

  public async scrapeTeamsByLeague(
    leagueSlug: string,
    leagueId: number,
    options: ScrapingOptions,
  ): Promise<TeamScrapingResult> {
    const startTime = Date.now();
    this._scrapingLoading.value = true;

    try {
      const scrapedTeams = await this.scrapingService.getScrapedTeams({ leagueId, leagueSlug });

      const filteredTeams = options.nameFilter
        ? scrapedTeams.filter((team) =>
            team.name.toLowerCase().includes(options.nameFilter!.toLowerCase()),
          )
        : scrapedTeams;

      const result = this.processScrapedTeams(filteredTeams, options);
      const duration = Date.now() - startTime;

      const fullResult: TeamScrapingResult = {
        ...result,
        type: ScrapingType.TEAMS,
        timestamp: new Date(),
        duration,
        details: {
          leagueName: leagueSlug,
          leagueId: leagueId,
        },
      };

      this._lastScrapingResult.value = fullResult;
      this._scrapingHistory.value.unshift(fullResult);

      if (this._scrapingHistory.value.length > 10) {
        this._scrapingHistory.value = this._scrapingHistory.value.slice(0, 10);
      }

      return fullResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorResult: TeamScrapingResult = {
        success: false,
        type: ScrapingType.TEAMS,
        itemsScraped: 0,
        itemsCreated: 0,
        itemsUpdated: 0,
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
        scrapedItems: [],
        timestamp: new Date(),
        duration,
        details: {
          leagueName: leagueSlug,
        },
      };

      this._lastScrapingResult.value = errorResult;
      this._scrapingHistory.value.unshift(errorResult);
      throw error;
    } finally {
      this._scrapingLoading.value = false;
    }
  }

  private processScrapedTeams(
    scrapedTeams: ScrapedTeam[],
    options: ScrapingOptions,
  ): TeamScrapingProcessResult {
    const result = {
      success: true,
      itemsScraped: scrapedTeams.length,
      itemsCreated: 0,
      itemsUpdated: 0,
      errors: [] as string[],
      scrapedItems: scrapedTeams,
    };

    for (const scrapedTeam of scrapedTeams) {
      if (!options.createMissing && !options.updateExisting) continue;
      console.log('scrapedTeam create', scrapedTeam);
    }

    result.success = result.errors.length === 0 || result.itemsCreated + result.itemsUpdated > 0;
    return result;
  }
}
