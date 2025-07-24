import { computed, ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { ScrapingService } from 'src/modules/scraping/services/scraping.service';
import { TeamService } from 'src/modules/teams/services/team.service';
import { tryCatch } from 'src/modules/shared/utils/tryCatch.util';
import { objectComparer } from 'src/modules/shared/utils/objectComparer.util';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { TryCatchResult } from 'src/modules/shared/utils/tryCatch.util';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
import type {
  ScrapingResult,
  TeamScrapingProcessResult,
  TeamScrapingResult,
} from 'src/modules/scraping/dtos/scrapingResult.dto';

export interface ScrapingOptions {
  createMissing: boolean;
  activateNew?: boolean;
  updateExisting: boolean;
  preserveManualData: boolean;
  positionFilter?: string;
  nameFilter?: string;
  includeInactive?: boolean;
  isQueensLeague: boolean;
}

export function useScraping() {
  const notifications = useQuasarNotifications();

  // Services
  const scrapingService = new ScrapingService();
  const teamService = new TeamService();

  // Reactive state
  const scrapingLoading = ref(false);
  const lastScrapingResult = ref<ScrapingResult | null>(null);
  const scrapingHistory = ref<ScrapingResult[]>([]);

  const getTeamByScrapedTeam = async (scrapedTeam: ScrapedTeam): Promise<TryCatchResult<Team>> => {
    return tryCatch(() => teamService.getTeamBySlug(scrapedTeam.slug));
  };

  const createMissingTeam = async (
    scrapedTeam: ScrapedTeam,
    league: League,
  ): Promise<TryCatchResult<Team>> => {
    return tryCatch(() =>
      scrapingService.createTeamByScraping({
        name: scrapedTeam.name,
        logoUrl: scrapedTeam.logoUrl,
        slug: scrapedTeam.slug,
        leagueId: league.id,
        leagueUuid: league.uuid,
        country: league.country,
        city: league.city,
        referenceId: scrapedTeam.referenceId,
        referenceUrl: scrapedTeam.referenceUrl,
      }),
    );
  };

  const updateExistingTeam = async (
    existingTeam: Team,
    scrapedTeam: ScrapedTeam,
    league: League,
  ): Promise<TryCatchResult<Team>> => {
    return tryCatch(() =>
      scrapingService.updateTeamByScraping({
        name: scrapedTeam.name,
        logoUrl: scrapedTeam.logoUrl,
        slug: scrapedTeam.slug,
        leagueId: league.id,
        leagueUuid: league.uuid,
        country: league.country,
        city: league.city,
        uuid: existingTeam.uuid,
        referenceId: scrapedTeam.referenceId,
        referenceUrl: scrapedTeam.referenceUrl,
      }),
    );
  };

  const processScrapedTeams = async (
    scrapedTeams: ScrapedTeam[],
    league: League,
    options: ScrapingOptions,
  ): Promise<TeamScrapingProcessResult> => {
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

    const processingPromises = scrapedTeams.map(async (scrapedTeam) => {
      const { data: existingTeam } = await getTeamByScrapedTeam(scrapedTeam);

      if (existingTeam) {
        const { hasChanges } = objectComparer.compare<object>(existingTeam, scrapedTeam);

        if (options.updateExisting && hasChanges) {
          const { error: updateTeamErrorMessage } = await updateExistingTeam(
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
          const { error: createTeamErrorMessage } = await createMissingTeam(scrapedTeam, league);

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

    notifications.notifyInfo('Proceso terminado');

    return result;
  };

  const scrapeTeamsByLeague = async (
    league: League,
    options: ScrapingOptions,
  ): Promise<TeamScrapingResult> => {
    const startTime = Date.now();
    scrapingLoading.value = true;

    try {
      const scrapedTeams = await scrapingService.getScrapedTeams({
        leagueId: league.id,
        leagueSlug: league.slug,
      });

      const filteredTeams = options.nameFilter
        ? scrapedTeams.filter((team) =>
            team.name.toLowerCase().includes(options.nameFilter!.toLowerCase()),
          )
        : scrapedTeams;

      const result = await processScrapedTeams(filteredTeams, league, options);
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

      lastScrapingResult.value = fullResult;
      scrapingHistory.value.unshift(fullResult);

      if (scrapingHistory.value.length > 10) {
        scrapingHistory.value = scrapingHistory.value.slice(0, 10);
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

      lastScrapingResult.value = errorResult;
      scrapingHistory.value.unshift(errorResult);
      throw error;
    } finally {
      scrapingLoading.value = false;
    }
  };

  // Return the composable API
  return {
    // State
    scrapingLoading: computed(() => scrapingLoading.value),
    lastScrapingResult: computed(() => lastScrapingResult.value),
    scrapingHistory: computed(() => scrapingHistory.value),

    // Methods
    scrapeTeamsByLeague,
  };
}
