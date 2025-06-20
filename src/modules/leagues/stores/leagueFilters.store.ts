import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';

export interface LeagueFilters {
  search: string;
  country: string;
  status: LeagueStatus | '';
  isActive: boolean | null;
  isVisible: boolean | null;
}

const DEFAULT_LEAGUE_FILTERS = {
  search: '',
  country: '',
  status: '',
  isActive: null,
  isVisible: null,
} as LeagueFilters;

export const useLeagueFiltersStore = defineStore('leagueFilters', () => {
  const filters = ref<LeagueFilters>(DEFAULT_LEAGUE_FILTERS);

  const setFilters = (newFilters: Partial<LeagueFilters>): void => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const setFilter = (filterKey: keyof LeagueFilters, value: never): void => {
    filters.value[filterKey] = value;
  };

  const clearFilters = (): void => {
    filters.value = { ...DEFAULT_LEAGUE_FILTERS };
  };

  const clearFilter = (filterKey: keyof LeagueFilters): void => {
    filters.value = {
      ...filters.value,
      [filterKey]: DEFAULT_LEAGUE_FILTERS[filterKey],
    };
  };

  const hasActiveFilters = (): boolean => {
    return !!(
      filters.value.search ||
      filters.value.country ||
      filters.value.status ||
      filters.value.isActive ||
      filters.value.isVisible
    );
  };

  return {
    filters,

    // methods
    setFilters,
    clearFilters,
    setFilter,
    clearFilter,
    hasActiveFilters,
  };
});
