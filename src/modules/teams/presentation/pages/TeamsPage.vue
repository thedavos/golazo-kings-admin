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
              v-model="filters.search"
              outlined
              dense
              placeholder="Buscar equipos..."
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div v-if="showFilters" class="col-12 col-md-2">
            <q-select
              v-model="filters.city"
              :options="cityOptions"
              outlined
              dense
              clearable
              label="Ciudad"
            />
          </div>

          <div v-if="showFilters" class="col-12 col-md-2">
            <q-select
              v-model="filters.country"
              :options="countryOptions"
              outlined
              dense
              clearable
              label="País"
            />
          </div>

          <div v-if="showFilters" class="col-12 col-md-2">
            <q-select
              v-model="filters.leagueId"
              :options="leagueOptions"
              outlined
              dense
              clearable
              label="Liga"
              option-label="name"
              option-value="id"
              emit-value
              map-options
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
            <q-btn-dropdown flat dense rounded no-icon-animation dropdown-icon="more_vert">
              <q-list padding separator>
                <q-item clickable v-close-popup @click="viewTeam(props.row)">
                  <q-item-section>
                    <q-item-label>Ver detalles</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editTeam(props.row)">
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <TeamDetailDialog
      v-if="selectedTeam"
      v-model="showDetailDialog"
      :selected-team="selectedTeam"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import { useTeamViewModel } from 'src/modules/teams/presentation/viewmodels/team.viewmodel';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

import TeamDetailDialog from 'src/modules/teams/presentation/dialogs/TeamDetailDialog.vue';

const { params } = useRoute();
const leagueViewModel = useLeagueViewModel();
const {
  cities,
  countries,
  teams,
  loadings,
  filters,
  setFilters,
  clearFilters,
  selectedTeam,
  selectTeam,
  clearSelection,
} = useTeamViewModel();

// State
const showFormDialog = ref(false);
const showDetailDialog = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');

if (params.leagueId) {
  setFilters({
    leagueId: Number(params.leagueId),
  });
}

// Computed
const cityOptions = computed(() => cities.value.map((city) => ({ label: city, value: city })));
const countryOptions = computed(() =>
  countries.value.map((country) => ({ label: country, value: country })),
);
const leagueOptions = computed(() => leagueViewModel.leagues.value);
const loading = computed(() => loadings.value.any);
const showFilters = computed(() => !params.leagueId);

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
function clearAllFilters() {
  clearFilters();
}

function openCreateDialog() {
  clearSelection();
  dialogMode.value = 'create';
  showFormDialog.value = true;
}

function viewTeam(team: Team) {
  selectTeam(team);
  showDetailDialog.value = true;
}

function editTeam(team: Team) {
  selectTeam(team);
  dialogMode.value = 'edit';
  showFormDialog.value = true;
}

// function onTeamSaved() {
//   showFormDialog.value = false;
//   selectedTeam.value = null;
// }
</script>
