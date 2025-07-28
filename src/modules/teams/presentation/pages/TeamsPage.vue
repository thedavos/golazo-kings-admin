<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none">Equipos</h4>
        <p class="text-grey-6">Administra los equipos de todas las ligas</p>
      </div>
      <q-btn color="primary" icon="add" label="Nuevo Equipo" @click="showCreateDialog = true" />
    </div>

    <!-- Stats Cards -->
    <team-stat-cards
      class="q-mb-lg"
      :total-teams="totalTeams"
      :active-teams="activeTeams"
      :queens-teams="queensTeams"
      :leagues="leaguesCount"
    />

    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="filters.search"
            label="Buscar equipo"
            outlined
            dense
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-if="showFilters"
            v-model="filters.city"
            :options="cityOptions"
            label="Ciudad"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-if="showFilters"
            v-model="filters.country"
            :options="countryOptions"
            label="País"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-if="showFilters"
            v-model="filters.leagueId"
            :options="leagueOptions"
            label="Liga"
            outlined
            dense
            clearable
            option-label="name"
            option-value="id"
            emit-value
            map-options
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="queensLeagueFilter"
            :options="queensTeamOptions"
            label="Tipo"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-btn
            color="grey-6"
            flat
            icon="clear"
            label="Limpiar filtros"
            @click="clearAllFilters"
            class="col-auto"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Teams Table -->
    <q-card>
      <q-table
        :rows="teams"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        flat
        bordered
      >
        <!-- Logo column -->
        <template v-slot:body-cell-logo="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.logoUrl" size="40px">
              <img :src="props.row.logoUrl" :alt="props.row.name" />
            </q-avatar>
            <q-avatar v-else color="grey-4" text-color="grey-8" icon="sports_soccer" size="40px" />
          </q-td>
        </template>

        <!-- Team info column -->
        <template v-slot:body-cell-team="props">
          <q-td :props="props">
            <div>
              <div class="text-weight-bold">{{ props.row.name }}</div>
              <div class="text-grey-6 text-caption">{{ props.row.abbr || 'Sin abreviación' }}</div>
            </div>
          </q-td>
        </template>

        <!-- League column -->
        <template v-slot:body-cell-league="props">
          <q-td :props="props">
            <q-chip
              v-if="props.row.leagueId"
              color="info"
              text-color="white"
              :label="getLeagueName(props.row.leagueId)"
              size="sm"
            />
            <span v-else class="text-grey-6">Sin liga</span>
          </q-td>
        </template>

        <!-- Location column -->
        <template v-slot:body-cell-location="props">
          <q-td :props="props">
            <div>
              <div>{{ props.row.city }}</div>
              <div class="text-grey-6 text-caption">{{ props.row.country }}</div>
            </div>
          </q-td>
        </template>

        <!-- Type column -->
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.isQueensLeagueTeam ? 'pink' : 'primary'"
              text-color="white"
              :label="props.row.isQueensLeagueTeam ? 'Queens League' : 'Kings League'"
              size="sm"
            />
          </q-td>
        </template>

        <!-- Actions column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown flat dense rounded no-icon-animation dropdown-icon="more_vert">
              <q-list padding separator>
                <q-item clickable v-close-popup @click="viewTeam(props.row)">
                  <q-item-section>
                    <q-item-label>Ver detalles</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="viewTeamPlayers(props.row)">
                  <q-item-section>
                    <q-item-label>Ver jugadores</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editTeam(props.row)">
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="confirmDelete(props.row)">
                  <q-item-section>
                    <q-item-label class="text-negative">Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialogs -->
    <view-team-dialog
      v-if="teamToView"
      :model-value="showDetailsDialog"
      :view-team="teamToView"
      @close="onCloseViewDialog"
      @edit="onEditFromView"
    />

    <create-team-dialog
      :model-value="showCreateDialog"
      @close="onCloseCreateDialog"
      @created="onTeamCreated"
    />

    <edit-team-dialog
      v-if="teamToEdit"
      :model-value="showEditDialog"
      :team="teamToEdit"
      @close="onCloseEditDialog"
      @saved="onTeamSaved"
    />

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmar eliminación</span>
        </q-card-section>

        <q-card-section>
          <p>
            ¿Estás seguro de que quieres eliminar el equipo
            <strong>{{ teamToDelete?.name }}</strong
            >?
          </p>
          <p class="text-caption text-grey-6">
            Esta acción no se puede deshacer y eliminará todos los datos relacionados.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn color="negative" label="Eliminar" :loading="loadings.delete" @click="deleteTeam" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRouteParams } from '@vueuse/router';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useLeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import { useTeamViewModel } from 'src/modules/teams/presentation/viewmodels/team.viewmodel';
import type { LocationQuery } from 'vue-router';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

// Import components
import TeamStatCards from '../components/TeamStatCards.vue';
import ViewTeamDialog from '../dialogs/ViewTeamDialog.vue';
import CreateTeamDialog from '../dialogs/CreateTeamDialog.vue';
import EditTeamDialog from '../dialogs/EditTeamDialog.vue';

const router = useRouter();
const leagueId = useRouteParams('leagueId', '', { transform: Number });
const teamSlug = useRouteParams('teamSlug', '');
const notifications = useQuasarNotifications();
const leagueViewModel = useLeagueViewModel();
const {
  cities,
  countries,
  teams,
  loadings,
  filters,
  setFilters,
  clearFilters,
  loadTeams,
  getTeamBySlug,
  deleteTeam: deleteTeamAction,
} = useTeamViewModel();

router.beforeEach((to, from) => {
  if (to.path === '/teams' && from.params.teamSlug) {
    showDetailsDialog.value = false;
  }
});

// Apply leagueId filter if provided in route params
if (leagueId.value) {
  setFilters({
    leagueId: leagueId.value,
  });
}

// Dialog states
const showCreateDialog = ref(false);
const showDetailsDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

// Team states
const teamToView = ref<Team | null>(null);
const teamToEdit = ref<Team | null>(null);
const teamToDelete = ref<Team | null>(null);

// Queens League filter
const queensLeagueFilter = ref<{ label: string; value: boolean } | null>(null);

// Watch for changes in queensLeagueFilter
watch(
  () => queensLeagueFilter.value,
  (newValue) => {
    if (newValue === null) {
      const { ...restFilters } = filters.value;
      setFilters(restFilters);
    } else {
      // Otherwise, set the filter
      setFilters({ isQueensLeagueTeam: newValue.value });
    }
  },
);

// Computed
const cityOptions = computed(() => cities.value.map((city) => ({ label: city, value: city })));

const countryOptions = computed(() =>
  countries.value.map((country) => ({ label: country, value: country })),
);

const leagueOptions = computed(() => leagueViewModel.leagues.value);

const queensTeamOptions = computed(() => [
  { label: 'Queens League', value: true },
  { label: 'Kings League', value: false },
]);

const loading = computed(() => loadings.value.any);
const showFilters = computed(() => !leagueId.value);

// Stats
const totalTeams = computed(() => teams.value.length);
const activeTeams = computed(() => teams.value.filter((team) => team.leagueId !== null).length);
const queensTeams = computed(() => teams.value.filter((team) => team.isQueensLeagueTeam).length);
const leaguesCount = computed(() => {
  const uniqueLeagueIds = new Set(teams.value.map((team) => team.leagueId).filter(Boolean));
  return uniqueLeagueIds.size;
});

// Table columns
const columns = [
  {
    name: 'logo',
    label: 'Logo',
    field: 'logoUrl',
    align: 'center' as const,
    sortable: false,
  },
  {
    name: 'team',
    label: 'Equipo',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'league',
    label: 'Liga',
    field: 'leagueId',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'location',
    label: 'Ubicación',
    field: 'city',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'isQueensLeagueTeam',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center' as const,
    sortable: false,
  },
];

// Methods
function clearAllFilters() {
  clearFilters();
  queensLeagueFilter.value = null;
}

function getLeagueName(leagueId: number): string {
  const league = leagueViewModel.leagues.value.find((l) => l.id === leagueId);
  return league ? league.name : `Liga ${leagueId}`;
}

// View team
async function viewTeam(team: Team, query: LocationQuery = {}) {
  teamToView.value = team;
  await router.push({ name: 'team-details', params: { teamSlug: team.slug }, query });
  showDetailsDialog.value = true;
}

function viewTeamPlayers(team: Team) {
  void viewTeam(team, {
    tab: 'players',
  } as LocationQuery);
}

async function onCloseViewDialog() {
  showDetailsDialog.value = false;
  teamToView.value = null;
  await router.push({ path: '/teams' });
}

// Edit team
function editTeam(team: Team) {
  teamToEdit.value = team;
  showEditDialog.value = true;
}

async function onEditFromView() {
  if (teamToView.value) {
    editTeam(teamToView.value);
    await onCloseViewDialog();
  }
}

function onCloseEditDialog() {
  showEditDialog.value = false;
  teamToEdit.value = null;
}

function onTeamSaved() {
  notifications.notifySuccess('Equipo actualizado exitosamente');
  void loadTeams();
  onCloseEditDialog();
}

// Create team
function onCloseCreateDialog() {
  showCreateDialog.value = false;
}

function onTeamCreated(teamId: number) {
  notifications.notifySuccess(`Equipo creado exitosamente: ${teamId}`);
  void loadTeams();
}

// Delete team
function confirmDelete(team: Team) {
  teamToDelete.value = team;
  showDeleteDialog.value = true;
}

async function deleteTeam() {
  if (!teamToDelete.value) return;

  try {
    await deleteTeamAction();
    notifications.notifySuccess(`Equipo ${teamToDelete.value.name} eliminado exitosamente`);
    showDeleteDialog.value = false;
    teamToDelete.value = null;
    void loadTeams();
  } catch (error) {
    notifications.notifyError('Error al eliminar el equipo');
    console.error('Error deleting team:', error);
  }
}

// Load data
onMounted(async () => {
  await loadTeams();
  await leagueViewModel.loadLeagues();

  if (teamSlug.value) {
    const team = getTeamBySlug(teamSlug.value);
    if (team) await viewTeam(team);
  }
});
</script>
