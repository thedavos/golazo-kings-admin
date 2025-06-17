<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="text-h4 q-my-none">Equipos</h4>
        <p class="text-grey-6 q-mb-none">Administra los equipos de la Kings League</p>
      </div>
      <q-btn color="primary" icon="add" label="Nuevo Equipo" @click="openCreateDialog" />
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="searchText"
              outlined
              dense
              placeholder="Buscar equipos..."
              clearable
              @update:model-value="updateFilters"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="selectedCity"
              :options="cityOptions"
              outlined
              dense
              clearable
              label="Ciudad"
              @update:model-value="updateFilters"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="selectedCountry"
              :options="countryOptions"
              outlined
              dense
              clearable
              label="País"
              @update:model-value="updateFilters"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="selectedLeague"
              :options="leagueOptions"
              outlined
              dense
              clearable
              label="Liga"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              @update:model-value="updateFilters"
            />
          </div>

          <div class="col-12 col-md-2">
            <q-btn outline color="grey-7" icon="clear" label="Limpiar" @click="clearAllFilters" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Equipos -->
    <q-card>
      <q-table :rows="teams" :columns="columns" :loading="loading" row-key="id">
        <template v-slot:body-cell-logo="props">
          <q-td :props="props">
            <q-avatar size="40px">
              <img :src="props.value" :alt="props.row.name" />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div>
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey-6">{{ props.row.slug }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-location="props">
          <q-td :props="props">
            <div>
              <div>{{ props.row.city }}</div>
              <div class="text-caption text-grey-6">{{ props.row.country }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense color="primary" icon="visibility" @click="viewTeam(props.row)">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="warning" icon="edit" @click="editTeam(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="delete">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLeagues } from 'src/modules/leagues/presentation/composables/useLeagues.composable';
import { useTeamViewModel } from 'src/modules/teams/presentation/viewmodels/team.viewmodel';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { SelectedItem } from 'src/modules/shared/types/Quasar.types';

const leagueViewModel = useLeagues();
const { cities, countries, teams, loadings, setFilters, clearFilters } = useTeamViewModel();

// State
const showFormDialog = ref(false);
const showDetailDialog = ref(false);
const selectedTeam = ref<Team | null>(null);
const dialogMode = ref<'create' | 'edit'>('create');
const searchText = ref('');
const selectedCity = ref<SelectedItem | null>(null);
const selectedCountry = ref<SelectedItem | null>(null);
const selectedLeague = ref<SelectedItem | null>(null);

// Computed
const cityOptions = computed(() => cities.value.map((city) => ({ label: city, value: city })));
const countryOptions = computed(() =>
  countries.value.map((country) => ({ label: country, value: country })),
);
const leagueOptions = computed(() => leagueViewModel.leagues.value);
const loading = computed(() => loadings.value.any);

const columns = [
  {
    name: 'logo',
    label: 'Logo',
    field: 'logoUrl',
    align: 'center' as const,
    sortable: false,
  },
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'abbr',
    label: 'Abrev.',
    field: 'abbr',
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
    name: 'foundationYear',
    label: 'Fundación',
    field: 'foundationYear',
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
function updateFilters() {
  setFilters({
    search: searchText.value,
    city: selectedCity.value?.value || '',
    country: selectedCountry.value?.value || '',
    leagueId: Number(selectedLeague.value?.value) || undefined,
  });
}

function clearAllFilters() {
  searchText.value = '';
  selectedCity.value = null;
  selectedCountry.value = null;
  selectedLeague.value = null;
  clearFilters();
}

function openCreateDialog() {
  selectedTeam.value = null;
  dialogMode.value = 'create';
  showFormDialog.value = true;
}

function viewTeam(team: Team) {
  selectedTeam.value = team;
  showDetailDialog.value = true;
}

function editTeam(team: Team) {
  selectedTeam.value = team;
  dialogMode.value = 'edit';
  showFormDialog.value = true;
}

// function onTeamSaved() {
//   showFormDialog.value = false;
//   selectedTeam.value = null;
// }

// onMounted(async () => {
//   await Promise.all([teamViewModel.loadTeams()]);
// });
</script>
