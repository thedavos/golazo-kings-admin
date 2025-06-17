import { computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useQuery } from '@pinia/colada';
import { TeamService } from 'src/modules/teams/services/team.service';
import { useTeamFiltersStore } from 'src/modules/teams/stores/teamFilters.store';
import { useCacheConfig } from 'src/modules/shared/composables/useCacheConfig.composable';
import type { TeamFilters } from 'src/modules/teams/stores/teamFilters.store';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

export const useTeamListStore = defineStore('teamList', () => {
  const teamService = new TeamService();
  const teamFiltersStore = useTeamFiltersStore();
  const { filters } = storeToRefs(teamFiltersStore);
  const { themes } = useCacheConfig();

  const {
    data: allTeams,
    isLoading,
    error,
    refetch,
  } = useQuery({
    key: ['teams-all'],
    query: () => teamService.getTeams(),
    initialData: () => [] as Team[],
    ...themes.teams.list,
  });

  const applyFilters = (teams: Team[], teamFilters: TeamFilters) => {
    let result = [...teams];

    if (teamFilters.search?.trim()) {
      const searchTerm = teamFilters.search.toLowerCase().trim();

      result = result.filter((team) => {
        const searchableText = `${team.name} ${team.city} ${team.slug}`.toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }
    console.log(teamFilters.city);
    if (teamFilters.city?.trim()) {
      result = result.filter((team) => team.city === teamFilters.city);
    }

    if (teamFilters.country?.trim()) {
      result = result.filter((team) => team.country === teamFilters.country);
    }

    if (teamFilters.leagueId) {
      result = result.filter((team) => team.leagueId === teamFilters.leagueId);
    }

    return result;
  };

  const teams = computed(() => {
    if (!allTeams.value?.length) return [];
    return applyFilters(allTeams.value, filters.value);
  });

  const cities = computed(() => {
    if (!allTeams.value?.length) return [];

    const uniqueCities = new Set(allTeams.value.map((team) => team.city).filter(Boolean));

    return Array.from(uniqueCities).sort();
  });

  const countries = computed(() => {
    if (!allTeams.value?.length) return [];

    const uniqueCountries = new Set(allTeams.value.map((team) => team.country).filter(Boolean));

    return Array.from(uniqueCountries).sort();
  });

  const totalTeams = computed(() => teams.value?.length ?? 0);
  const hasResults = computed(() => totalTeams.value > 0);
  const isEmpty = computed(() => !isLoading.value && totalTeams.value === 0);

  return {
    teams,
    isLoading,
    error,
    cities,
    countries,
    totalTeams,
    hasResults,
    isEmpty,
    refetch,
  };
});
