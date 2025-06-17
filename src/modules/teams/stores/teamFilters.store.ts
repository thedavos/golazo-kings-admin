import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface TeamFilters {
  search?: string;
  city?: string;
  country?: string;
  leagueId?: number | undefined;
}

const DEFAULT_FILTERS: TeamFilters = {
  search: '',
  city: '',
  country: '',
  leagueId: undefined,
};

export const useTeamFiltersStore = defineStore('teamFilters', () => {
  const filters = ref<TeamFilters>({ ...DEFAULT_FILTERS });

  const setFilters = (newFilters: Partial<TeamFilters>): void => {
    const validatedFilters = { ...newFilters };

    if (validatedFilters.leagueId !== undefined && validatedFilters.leagueId < 0) {
      validatedFilters.leagueId = undefined;
    }

    if (validatedFilters.search) {
      validatedFilters.search = validatedFilters.search.trim();
    }

    filters.value = { ...filters.value, ...validatedFilters };
  };

  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.search ||
      filters.value.city ||
      filters.value.country ||
      filters.value.leagueId
    );
  });

  const activeFiltersCount = computed(() => {
    return Object.values(filters.value).filter(
      (value) => value !== '' && value !== undefined && value !== null,
    ).length;
  });

  const clearFilters = (): void => {
    filters.value = { ...DEFAULT_FILTERS };
  };

  const clearFilter = (filterKey: keyof TeamFilters): void => {
    filters.value = {
      ...filters.value,
      [filterKey]: DEFAULT_FILTERS[filterKey],
    };
  };

  return {
    // State
    filters,

    // Getters
    hasActiveFilters,
    activeFiltersCount,

    // Actions
    setFilters,
    clearFilters,
    clearFilter,
  };
});
