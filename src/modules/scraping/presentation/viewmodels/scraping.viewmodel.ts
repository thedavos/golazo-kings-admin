import { ref, computed } from 'vue';
import { ScrapingService } from 'src/modules/scraping/services/scraping.service';
import { TeamService } from 'src/modules/teams/services/team.service';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type {
  ScrapingResult,
  TeamScrapingResult,
  TeamScrapingProcessResult,
} from 'src/modules/scraping/dtos/scrapingResult.dto';
import type { UseQuasarNotificationReturn } from 'src/composables/useQuasarNotifications';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { TryCatchResult } from 'src/modules/shared/utils/tryCatch.util';
import { objectComparer } from 'src/modules/shared/utils/objectComparer.util';
import { tryCatch } from 'src/modules/shared/utils/tryCatch.util';

export interface ScrapingOptions {
  createMissing: boolean;
  updateExisting: boolean;
  preserveManualData: boolean;
  nameFilter?: string;
}

export class ScrapingViewModel {
  private scrapingService: ScrapingService;
  private teamService: TeamService;
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
    this.teamService = new TeamService();
    this.notifications = notifications;
  }

  public async scrapeTeamsByLeague(
    league: League,
    options: ScrapingOptions,
  ): Promise<TeamScrapingResult> {
    const startTime = Date.now();
    this._scrapingLoading.value = true;

    try {
      const scrapedTeams = await this.scrapingService.getScrapedTeams({
        leagueId: league.id,
        leagueSlug: league.slug,
      });

      const filteredTeams = options.nameFilter
        ? scrapedTeams.filter((team) =>
            team.name.toLowerCase().includes(options.nameFilter!.toLowerCase()),
          )
        : scrapedTeams;

      const result = await this.processScrapedTeams(filteredTeams, league, options);
      const duration = Date.now() - startTime;

      const fullResult: TeamScrapingResult = {
        ...result,
        type: ScrapingType.TEAMS,
        timestamp: new Date(),
        duration,
        details: {
          leagueName: league.slug,
          leagueId: league.id,
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
          leagueName: league.slug,
        },
      };

      this._lastScrapingResult.value = errorResult;
      this._scrapingHistory.value.unshift(errorResult);
      throw error;
    } finally {
      this._scrapingLoading.value = false;
    }
  }

  private async processScrapedTeams(
    scrapedTeams: ScrapedTeam[],
    league: League,
    options: ScrapingOptions,
  ): Promise<TeamScrapingProcessResult> {
    const result = {
      success: true,
      itemsScraped: scrapedTeams.length,
      itemsCreated: 0,
      itemsUpdated: 0,
      errors: [] as string[],
      scrapedItems: scrapedTeams,
    };

    if (!options.createMissing && !options.updateExisting) {
      result.success = true;
      return result;
    }

    console.log('options: ', options.createMissing);

    const processingPromises = scrapedTeams.map(async (scrapedTeam) => {
      const { data: existingTeam } = await this.getTeamByScrapedTeam(scrapedTeam);

      if (existingTeam) {
        const hasChanges = objectComparer.compare<object>(existingTeam, scrapedTeam).hasChanges;
        if (options.updateExisting && hasChanges) {
          const { error: updateTeamErrorMessage } = await this.updateExistingTeam(
            existingTeam,
            scrapedTeam,
            league,
          );

          if (updateTeamErrorMessage) {
            return {
              status: 'error',
              error: `Error actualizando a ${scrapedTeam.name}: ${updateTeamErrorMessage}`,
            };
          }

          return { status: 'updated' };
        }
      } else {
        if (options.createMissing) {
          const { error: createTeamErrorMessage } = await this.createMissingTeam(
            scrapedTeam,
            league,
          );

          if (createTeamErrorMessage) {
            return {
              status: 'error',
              error: `Error creando a ${scrapedTeam.name}: ${createTeamErrorMessage}`,
            };
          }

          return { status: 'created' };
        }
      }

      return { status: 'skipped' };
    });

    const outcomes = await Promise.all(processingPromises);

    for (const outcome of outcomes) {
      if (outcome.status === 'created') result.itemsCreated++;
      if (outcome.status === 'updated') result.itemsUpdated++;
      if (outcome.status === 'error') result.errors.push(outcome.error!);
    }

    result.success = result.errors.length === 0;
    return result;
  }

  private async getTeamByScrapedTeam(scrapedTeam: ScrapedTeam): Promise<TryCatchResult<Team>> {
    return tryCatch(() => this.teamService.getTeamBySlug(scrapedTeam.slug));
  }

  private async createMissingTeam(
    scrapedTeam: ScrapedTeam,
    league: League,
  ): Promise<TryCatchResult<Team>> {
    return tryCatch(() =>
      this.scrapingService.createTeamByScraping({
        name: scrapedTeam.name,
        logoUrl: scrapedTeam.logoUrl,
        slug: scrapedTeam.slug,
        leagueId: league.id,
        leagueUuid: league.uuid,
        country: league.country,
        city: league.city,
      }),
    );
  }

  private async updateExistingTeam(
    existingTeam: Team,
    scrapedTeam: ScrapedTeam,
    league: League,
  ): Promise<TryCatchResult<Team>> {
    return tryCatch(() =>
      this.scrapingService.updateTeamByScraping({
        name: scrapedTeam.name,
        logoUrl: scrapedTeam.logoUrl,
        slug: scrapedTeam.slug,
        leagueId: league.id,
        leagueUuid: league.uuid,
        country: league.country,
        city: league.city,
        uuid: existingTeam.uuid,
      }),
    );
  }
}
