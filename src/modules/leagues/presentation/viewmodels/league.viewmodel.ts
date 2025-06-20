import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLeagueListStore } from 'src/modules/leagues/stores/leagueList.store';
import { useLeagueFiltersStore } from 'src/modules/leagues/stores/leagueFilters.store';
import { useLeagueDetailsStore } from 'src/modules/leagues/stores/leagueDetails.store';

export const useLeagueViewModel = () => {
  const leagueListStore = useLeagueListStore();
  const leagueFiltersStore = useLeagueFiltersStore();
  const leagueDetailsStore = useLeagueDetailsStore();

  const { filters } = storeToRefs(leagueFiltersStore);
  const {
    leagues,
    isLoading: listLoading,
    error: listError,
    countries,
    activeLeagues,
    totalLeagues,
    visibleLeagues,
  } = storeToRefs(leagueListStore);
  const {
    selectedLeague,
    selectedLeagueId,
    hasSelectedLeague,
    leagueLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleStatusLoading,
    toggleVisibilityLoading,
    leagueError,
    createError,
    updateError,
    deleteError,
    toggleStatusError,
    toggleVisibilityError,
  } = storeToRefs(leagueDetailsStore);

  const loadings = computed(() => ({
    list: listLoading.value,
    detail: leagueLoading.value,
    create: createLoading.value,
    update: updateLoading.value,
    delete: deleteLoading.value,
    toggleStatus: toggleStatusLoading.value,
    toggleVisibility: toggleVisibilityLoading.value,
  }));

  const errors = computed(() => ({
    list: listError.value,
    detail: leagueError.value,
    create: createError.value,
    update: updateError.value,
    delete: deleteError.value,
    toggleStatus: toggleStatusError.value,
    toggleVisibility: toggleVisibilityError.value,
  }));

  return {
    // state
    loadings,
    errors,
    leagues,
    selectedLeague,
    filters,

    // computed
    countries,
    activeLeagues,
    totalLeagues,
    visibleLeagues,
    selectedLeagueId,
    hasSelectedLeague,

    // methods
    loadLeagues: leagueListStore.refetch,
    createLeague: leagueDetailsStore.createLeague,
    updateLeague: leagueDetailsStore.updateLeague,
    deleteLeague: leagueDetailsStore.deleteLeague,
    toggleLeagueStatus: leagueDetailsStore.toggleLeagueStatus,
    toggleLeagueVisibility: leagueDetailsStore.toggleLeagueVisibility,
    selectLeague: leagueDetailsStore.setLeague,
    setFilters: leagueFiltersStore.setFilters,
    clearFilters: leagueFiltersStore.clearFilters,
  };
};
