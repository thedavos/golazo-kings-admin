import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTeamFiltersStore } from 'src/modules/teams/stores/teamFilters.store';
import { useTeamListStore } from 'src/modules/teams/stores/teamList.store';
import { useTeamDetailsStore } from 'src/modules/teams/stores/teamDetails.store';

export function useTeamViewModel() {
  // Stores
  const teamListStore = useTeamListStore();
  const teamDetailsStore = useTeamDetailsStore();
  const teamFiltersStore = useTeamFiltersStore();

  const { filters } = storeToRefs(teamFiltersStore);
  const {
    teams,
    cities,
    countries,
    isLoading: loadingList,
    error: errorTeamList,
  } = storeToRefs(teamListStore);
  const {
    selectedTeam,
    isLoadingAny,
    teamLoading: loadingTeam,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    errorCreate,
    errorDelete,
    errorUpdate,
    teamError: errorTeam,
  } = storeToRefs(teamDetailsStore);

  const loadings = computed(() => ({
    list: loadingList?.value,
    team: loadingTeam?.value,
    create: loadingCreate?.value,
    update: loadingUpdate?.value,
    delete: loadingDelete?.value,
    any: isLoadingAny?.value,
  }));

  const errors = computed(() => ({
    list: errorTeamList?.value,
    team: errorTeam?.value,
    create: errorCreate?.value,
    update: errorUpdate?.value,
    delete: errorDelete?.value,
  }));

  const hasErrors = computed(() => Object.values(errors.value).some((error) => error !== null));

  return {
    // State
    filters,
    teams,
    cities,
    countries,
    selectedTeam,

    // Computed
    loadings,
    errors,
    hasErrors,

    // Methods
    loadTeams: () => teamListStore.refetch(),
    setFilters: teamFiltersStore.setFilters,
    clearFilters: teamFiltersStore.clearFilters,
    getTeamBySlug: teamListStore.getTeamBySlug,
    getTeamByUuid: teamListStore.getTeamByUuid,
    getTeamById: teamDetailsStore.fetchTeam,
    createTeam: teamDetailsStore.createTeam,
    updateTeam: teamDetailsStore.updateTeam,
    deleteTeam: teamDetailsStore.deleteTeam,
    selectTeam: teamDetailsStore.selectTeam,
    clearSelection: teamDetailsStore.clearSelection,
  };
}
