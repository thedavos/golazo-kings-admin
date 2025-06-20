import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { LeagueService } from 'src/modules/leagues/services/league.service';
import { MESSAGES } from 'src/modules/shared/constants/messages.constant';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';
import type { UpdateLeagueDto } from 'src/modules/leagues/dtos/update-league.dto';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';

const CACHE_KEYS = {
  LEAGUES: ['leagues'] as const,
  LEAGUE_DETAIL: (id: number) => ['leagues', id] as const,
} as const;

export const useLeagueDetailsStore = defineStore('leagueDetails', () => {
  // Composables
  const notifications = useQuasarNotifications();
  const queryCache = useQueryCache();

  // Service
  const leagueService = new LeagueService();

  const selectedLeague = ref<League | null>(null);
  const selectedLeagueId = computed(() => selectedLeague.value?.id);
  const hasSelectedLeague = computed(() => !!selectedLeague.value);

  const invalidateLeagueCaches = async (leagueId?: number) => {
    const promises = [];

    promises.push(queryCache.invalidateQueries({ key: CACHE_KEYS.LEAGUES }));

    if (leagueId) {
      promises.push(
        queryCache.invalidateQueries({
          key: CACHE_KEYS.LEAGUE_DETAIL(leagueId),
          exact: true,
        }),
      );
    }

    await Promise.all(promises);
  };

  const getLeagueQuery = useQuery({
    key: CACHE_KEYS.LEAGUE_DETAIL(selectedLeagueId.value!),
    query: (): Promise<League> => {
      if (!selectedLeagueId.value) {
        throw new Error('No team ID selected');
      }

      return leagueService.getLeagueById(selectedLeagueId.value);
    },
    enabled: () => hasSelectedLeague.value,
  });

  const createLeagueMutation = useMutation({
    mutation: (leagueData: CreateLeagueDto) => leagueService.createLeague(leagueData),
    async onSuccess(newLeague) {
      notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_CREATED);
      await invalidateLeagueCaches(newLeague.id);
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  const updateLeagueMutation = useMutation({
    mutation: (leagueData: UpdateLeagueDto) =>
      leagueService.updateLeague(selectedLeagueId.value!, leagueData),
    async onSuccess(leagueUpdated) {
      notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_UPDATED);
      await invalidateLeagueCaches(leagueUpdated.id);
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  const deleteLeagueMutation = useMutation({
    mutation: (leagueId: number) => leagueService.deleteLeague(leagueId || selectedLeagueId.value!),
    async onSuccess() {
      notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_DELETED);
      await invalidateLeagueCaches(selectedLeagueId.value);
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  const toggleLeagueStatusMutation = useMutation({
    mutation: (leagueId: number) =>
      leagueService.toggleLeagueStatus(leagueId || selectedLeagueId.value!),
    async onSuccess(leagueUpdated) {
      notifications.notifySuccess(
        leagueUpdated.status === LeagueStatus.ACTIVE
          ? MESSAGES.SUCCESS.LEAGUE_ACTIVATED
          : MESSAGES.SUCCESS.LEAGUE_DEACTIVATED,
      );
      await invalidateLeagueCaches(leagueUpdated.id);
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  const toggleLeagueVisibilityMutation = useMutation({
    mutation: (leagueId: number) =>
      leagueService.toggleLeagueVisibility(leagueId || selectedLeagueId.value!),
    async onSuccess(leagueUpdated) {
      notifications.notifySuccess(
        leagueUpdated.isVisible ? MESSAGES.SUCCESS.LEAGUE_VISIBLE : MESSAGES.SUCCESS.LEAGUE_HIDDEN,
      );
      await invalidateLeagueCaches(leagueUpdated.id);
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  const setLeague = (league: League) => {
    selectedLeague.value = league;
  };

  const clearSelection = () => {
    selectedLeague.value = null;
  };

  return {
    // state
    league: getLeagueQuery.data,
    leagueLoading: getLeagueQuery.isLoading,
    createLoading: createLeagueMutation.isLoading,
    updateLoading: updateLeagueMutation.isLoading,
    deleteLoading: deleteLeagueMutation.isLoading,
    toggleStatusLoading: toggleLeagueStatusMutation.isLoading,
    toggleVisibilityLoading: toggleLeagueVisibilityMutation.isLoading,
    leagueError: getLeagueQuery.error,
    createError: createLeagueMutation.error,
    updateError: updateLeagueMutation.error,
    deleteError: deleteLeagueMutation.error,
    toggleStatusError: toggleLeagueStatusMutation.error,
    toggleVisibilityError: toggleLeagueVisibilityMutation.error,
    selectedLeague,

    // computed
    leagueStatus: computed(() => getLeagueQuery.data.value?.status),
    leagueVisibility: computed(() => getLeagueQuery.data.value?.isVisible),
    selectedLeagueId,
    hasSelectedLeague,

    // methods
    getLeague: getLeagueQuery.refresh,
    createLeague: createLeagueMutation.mutateAsync,
    updateLeague: updateLeagueMutation.mutateAsync,
    deleteLeague: deleteLeagueMutation.mutateAsync,
    toggleLeagueStatus: toggleLeagueStatusMutation.mutateAsync,
    toggleLeagueVisibility: toggleLeagueVisibilityMutation.mutateAsync,
    setLeague,
    clearSelection,
  };
});
