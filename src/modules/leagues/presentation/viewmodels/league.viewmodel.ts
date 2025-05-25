import { ref, reactive, computed } from 'vue';
import { Loading } from 'quasar';
import { LeagueService } from 'src/modules/leagues/services/league.service';
import { MESSAGES } from 'src/modules/shared/constants/messages.constant';
import type { UseQuasarNotificationReturn } from 'src/composables/useQuasarNotifications';
import type { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';
import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';
import type { UpdateLeagueDto } from 'src/modules/leagues/dtos/update-league.dto';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

export interface LeagueFilters {
  search: string;
  country: string;
  status: LeagueStatus | '';
  isActive: boolean | null;
  isVisible: boolean | null;
}

export class LeagueViewModel {
  private leagueService: LeagueService;
  private notifications: UseQuasarNotificationReturn;

  public leagues = ref<League[]>([]);
  public selectedLeague = ref<League | null>(null);
  public loading = ref(false);
  public error = ref<string | null>(null);

  public filters = reactive<LeagueFilters>({
    search: '',
    country: '',
    status: '',
    isActive: null,
    isVisible: null,
  });

  constructor(notifications: UseQuasarNotificationReturn) {
    this.leagueService = new LeagueService();
    this.notifications = notifications;
  }

  get filteredLeagues() {
    return computed(() => {
      let filtered = this.leagues.value;

      // Filtro por búsqueda
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (league) =>
            league.name.toLowerCase().includes(search) ||
            league.abbr.toLowerCase().includes(search) ||
            league.country.toLowerCase().includes(search) ||
            league.city.toLowerCase().includes(search),
        );
      }

      // Filtro por país
      if (this.filters.country) {
        filtered = filtered.filter(
          (league) => league.country.toLowerCase() === this.filters.country.toLowerCase(),
        );
      }

      // Filtro por estado
      if (this.filters.status) {
        filtered = filtered.filter((league) => league.status === this.filters.status);
      }

      // Filtro por activo
      if (this.filters.isActive !== null) {
        filtered = filtered.filter((league) => league.isActive === this.filters.isActive);
      }

      // Filtro por visible
      if (this.filters.isVisible !== null) {
        filtered = filtered.filter((league) => league.isVisible === this.filters.isVisible);
      }

      return filtered;
    });
  }

  get countries() {
    return computed(() => {
      const countrySet = new Set(this.leagues.value.map((league) => league.country));
      return Array.from(countrySet).sort();
    });
  }

  get totalLeagues() {
    return computed(() => this.leagues.value.length);
  }

  get activeLeagues() {
    return computed(() => this.leagues.value.filter((league) => league.isActive).length);
  }

  get visibleLeagues() {
    return computed(() => this.leagues.value.filter((league) => league.isVisible).length);
  }

  async loadLeagues(): Promise<void> {
    try {
      this.loading.value = true;
      this.error.value = null;
      this.leagues.value = await this.leagueService.getLeagues();
    } catch (error: any) {
      this.error.value = error.message;
      this.notifications.notifyError(`Error al cargar las ligas: ${error.message}`);
    } finally {
      this.loading.value = false;
    }
  }

  async loadLeagueById(id: number): Promise<void> {
    try {
      this.loading.value = true;
      this.error.value = null;
      this.selectedLeague.value = await this.leagueService.getLeagueById(id);
    } catch (error: any) {
      this.error.value = error.message;
      this.notifications.notifyError(`Error al cargar la liga: ${error.message}`);
    } finally {
      this.loading.value = false;
    }
  }

  async createLeague(leagueData: CreateLeagueDto): Promise<void> {
    try {
      Loading.show({ message: 'Creando liga...' });
      const newLeague = await this.leagueService.createLeague(leagueData);
      this.leagues.value.push(newLeague);
      this.notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_CREATED);
    } catch (error: any) {
      this.notifications.notifyError(`Error al crear la liga: ${error.message}`);
      throw error;
    } finally {
      Loading.hide();
    }
  }

  async updateLeague(id: number, leagueData: UpdateLeagueDto): Promise<void> {
    try {
      Loading.show({ message: 'Actualizando liga...' });
      const updatedLeague = await this.leagueService.updateLeague(id, leagueData);
      const index = this.leagues.value.findIndex((league) => league.id === id);

      if (index !== -1) {
        this.leagues.value[index] = updatedLeague;
      }

      if (this.selectedLeague.value?.id === id) {
        this.selectedLeague.value = updatedLeague;
      }

      this.notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_UPDATED);
    } catch (error: any) {
      this.notifications.notifyError(`Error al actualizar la liga: ${error.message}`);
      throw error;
    } finally {
      Loading.hide();
    }
  }

  async deleteLeague(id: number): Promise<void> {
    try {
      Loading.show({ message: 'Eliminando liga...' });
      await this.leagueService.deleteLeague(id);
      this.leagues.value = this.leagues.value.filter((league) => league.id !== id);

      if (this.selectedLeague.value?.id === id) {
        this.selectedLeague.value = null;
      }

      this.notifications.notifySuccess(MESSAGES.SUCCESS.LEAGUE_DELETED);
    } catch (error: any) {
      this.notifications.notifyError(`Error al eliminar la liga: ${error.message}`);
      throw error;
    } finally {
      Loading.hide();
    }
  }

  async toggleLeagueStatus(id: number): Promise<void> {
    try {
      const updatedLeague = await this.leagueService.toggleLeagueStatus(id);
      const index = this.leagues.value.findIndex((league) => league.id === id);

      if (index !== -1) {
        this.leagues.value[index] = updatedLeague;
      }

      this.notifications.notifySuccess(
        updatedLeague.isActive
          ? MESSAGES.SUCCESS.LEAGUE_ACTIVATED
          : MESSAGES.SUCCESS.LEAGUE_DEACTIVATED,
      );
    } catch (error: any) {
      this.notifications.notifyError(`Error al cambiar el estado de la liga: ${error.message}`);
    }
  }

  async toggleLeagueVisibility(id: number): Promise<void> {
    try {
      const updatedLeague = await this.leagueService.toggleLeagueVisibility(id);
      const index = this.leagues.value.findIndex((league) => league.id === id);

      if (index !== -1) {
        this.leagues.value[index] = updatedLeague;
      }

      this.notifications.notifySuccess(
        updatedLeague.isVisible ? MESSAGES.SUCCESS.LEAGUE_VISIBLE : MESSAGES.SUCCESS.LEAGUE_HIDDEN,
      );
    } catch (error: any) {
      this.notifications.notifyError(
        `Error al cambiar la visibilidad de la liga: ${error.message}`,
      );
    }
  }

  clearFilters(): void {
    this.filters.search = '';
    this.filters.country = '';
    this.filters.status = '';
    this.filters.isActive = null;
    this.filters.isVisible = null;
  }

  selectLeague(league: League): void {
    this.selectedLeague.value = league;
  }

  clearSelection(): void {
    this.selectedLeague.value = null;
  }

  refreshLeagues(): Promise<void> {
    return this.loadLeagues();
  }
}
