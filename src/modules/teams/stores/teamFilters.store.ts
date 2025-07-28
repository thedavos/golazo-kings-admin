import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { SelectedItem } from 'src/modules/shared/types/Quasar.types';

export interface TeamFilters {
  search?: string;
  city?: SelectedItem | null;
  country?: SelectedItem | null;
  leagueId?: number | null;
  isQueensLeagueTeam: boolean;
}

const DEFAULT_FILTERS: TeamFilters = {
  search: '',
  city: null,
  country: null,
  leagueId: null,
  isQueensLeagueTeam: false,
};

export const useTeamFiltersStore = defineStore('teamFilters', () => {
  const filters = ref<TeamFilters>({ ...DEFAULT_FILTERS });

  const setFilters = (newFilters: Partial<TeamFilters>): void => {
    const validatedFilters = { ...newFilters };

    if (validatedFilters.leagueId && validatedFilters.leagueId < 0) {
      validatedFilters.leagueId = null;
    }

    if (validatedFilters.search) {
      validatedFilters.search = validatedFilters.search.trim();
    }

    filters.value = { ...filters.value, ...validatedFilters };
  };

  const setLeagueFilter = (leagueId: number | null): void => {
    filters.value = { ...filters.value, leagueId };
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
    setLeagueFilter,
    clearFilters,
    clearFilter,
  };
});
