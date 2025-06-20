import { computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useQuery } from '@pinia/colada';
import { LeagueService } from 'src/modules/leagues/services/league.service';
import { useLeagueFiltersStore } from 'src/modules/leagues/stores/leagueFilters.store';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

export const useLeagueListStore = defineStore('leagueList', () => {
  const leagueService = new LeagueService();

  const leagueFiltersStore = useLeagueFiltersStore();
  const { filters } = storeToRefs(leagueFiltersStore);

  const {
    data: allLeagues,
    isLoading,
    error,
    refetch,
  } = useQuery({
    key: ['leagues-all'],
    query: () => leagueService.getLeagues(),
    initialData: () => [] as League[],
  });

  const leagues = computed(() => {
    if (!allLeagues.value?.length) return [];
    let filtered = [...allLeagues.value];

    if (filters.value.search?.trim()) {
      const searchTerm = filters.value.search.toLowerCase();

      filtered = filtered.filter((league) => {
        const searchableText =
          `${league.name} ${league.abbr} ${league.country} ${league.city}`.toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }

    // Filtro por país
    if (filters.value.country) {
      filtered = filtered.filter(
        (league) => league.country.toLowerCase() === filters.value.country.toLowerCase(),
      );
    }

    // Filtro por estado
    if (filters.value.status) {
      filtered = filtered.filter((league) => league.status === filters.value.status);
    }

    // Filtro por activo
    if (filters.value.isActive !== null) {
      filtered = filtered.filter((league) => league.isActive === filters.value.isActive);
    }

    // Filtro por visible
    if (filters.value.isVisible !== null) {
      filtered = filtered.filter((league) => league.isVisible === filters.value.isVisible);
    }

    return filtered;
  });

  const countries = computed(() => {
    const countrySet = new Set(allLeagues.value.map((league) => league.country));
    return Array.from(countrySet).sort();
  });

  const totalLeagues = computed(() => allLeagues.value.length);

  const activeLeagues = computed(() => allLeagues.value.filter((league) => league.isActive).length);

  const visibleLeagues = computed(
    () => allLeagues.value.filter((league) => league.isVisible).length,
  );

  return {
    allLeagues,
    isLoading,
    error,
    refetch,

    // computed
    leagues,
    countries,
    totalLeagues,
    activeLeagues,
    visibleLeagues,
  };
});
