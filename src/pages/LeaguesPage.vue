<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none">Ligas</h4>
        <p class="text-grey-6">Administra las ligas de Kings League</p>
      </div>
      <q-btn color="primary" icon="add" label="Nueva Liga" @click="showCreateDialog = true" />
    </div>

    <!-- Stats Cards -->
    <div class="row q-gutter-md q-mb-lg">
      <q-card class="col-md-3 col-sm-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ viewModel.totalLeagues.value }}</div>
          <div class="text-grey-6">Total de Ligas</div>
        </q-card-section>
      </q-card>

      <q-card class="col-md-3 col-sm-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ viewModel.activeLeagues.value }}</div>
          <div class="text-grey-6">Ligas Activas</div>
        </q-card-section>
      </q-card>

      <q-card class="col-md-3 col-sm-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ viewModel.visibleLeagues.value }}</div>
          <div class="text-grey-6">Ligas Visibles</div>
        </q-card-section>
      </q-card>

      <q-card class="col-md-3 col-sm-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ viewModel.countries.value.length }}</div>
          <div class="text-grey-6">Países</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="viewModel.filters.search"
            label="Buscar liga"
            outlined
            dense
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="viewModel.filters.country"
            :options="countryOptions"
            label="País"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="viewModel.filters.status"
            :options="statusOptions"
            label="Estado"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="viewModel.filters.isActive"
            :options="activeOptions"
            label="Activa"
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
            @click="viewModel.clearFilters"
            class="col-auto"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Leagues Table -->
    <q-card>
      <q-table
        :rows="viewModel.filteredLeagues.value"
        :columns="columns"
        :loading="viewModel.loading.value"
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

        <!-- League info column -->
        <template v-slot:body-cell-league="props">
          <q-td :props="props">
            <div>
              <div class="text-weight-bold">{{ props.row.name }}</div>
              <div class="text-grey-6 text-caption">{{ props.row.abbr }}</div>
            </div>
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

        <!-- Status column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              :label="props.row.status"
              size="sm"
            />
          </q-td>
        </template>

        <!-- Active column -->
        <template v-slot:body-cell-isActive="props">
          <q-td :props="props">
            <q-toggle
              :model-value="props.row.isActive"
              @update:model-value="toggleActive(props.row.id)"
              color="positive"
            />
          </q-td>
        </template>

        <!-- Visible column -->
        <template v-slot:body-cell-isVisible="props">
          <q-td :props="props">
            <q-toggle
              :model-value="props.row.isVisible"
              @update:model-value="toggleVisible(props.row.id)"
              color="info"
            />
          </q-td>
        </template>

        <!-- Actions column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="primary"
              icon="visibility"
              size="sm"
              flat
              round
              @click="viewLeague(props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn color="warning" icon="edit" size="sm" flat round @click="editLeague(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              color="negative"
              icon="delete"
              size="sm"
              flat
              round
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useLeagues } from 'src/modules/leagues/presentation/composables/useLeagues.composable';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
// import type { League } from 'src/modules/leagues/domain/entities/league.entity';
// import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';

const notificationService = useQuasarNotifications();
const viewModel = useLeagues(notificationService);

// Dialog states
const showCreateDialog = ref(false);
// const showDetailsDialog = ref(false);
// const showDeleteDialog =

// Form state
// const editingLeague = ref<League | null>(null);
// const leagueToDelete = ref<League | null>(null);

// Form data
// const leagueForm = ref<CreateLeagueDto>({
//   name: '',
//   slug: '',
//   abbr: '',
//   country: '',
//   city: '',
//   logoUrl: null,
//   numberOfTeams: 12,
//   description: '',
//   foundationYear: null,
//   instagramHandle: null,
//   twitterHandle: null,
//   website: null,
//   rules: null,
//   status: LeagueStatus.DRAFT,
//   isActive: false,
//   isVisible: true,
// });

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
    name: 'league',
    label: 'Liga',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'location',
    label: 'Ubicación',
    field: 'country',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'numberOfTeams',
    label: 'Equipos',
    field: 'numberOfTeams',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'isActive',
    label: 'Activa',
    field: 'isActive',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'isVisible',
    label: 'Visible',
    field: 'isVisible',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: '',
    align: 'center' as const,
    sortable: false,
  },
];

// Filter options
const countryOptions = computed(() => viewModel.countries.value);

const statusOptions = [
  { label: 'Borrador', value: LeagueStatus.DRAFT },
  { label: 'Activa', value: LeagueStatus.ACTIVE },
  { label: 'Inactiva', value: LeagueStatus.INACTIVE },
  { label: 'Archivada', value: LeagueStatus.ARCHIVED },
];

const activeOptions = [
  { label: 'Activa', value: true },
  { label: 'Inactiva', value: false },
];

// Methods
const getStatusColor = (status: LeagueStatus): string => {
  const colors = {
    [LeagueStatus.DRAFT]: 'grey',
    [LeagueStatus.ACTIVE]: 'positive',
    [LeagueStatus.INACTIVE]: 'warning',
    [LeagueStatus.ARCHIVED]: 'negative',
  };
  return colors[status] || 'grey';
};

const viewLeague = (league: League) => {
  console.log('viewLeague', league);
};

const editLeague = (league: League) => {
  console.log('editLeague', league);
};

const confirmDelete = (league: League) => {
  console.log('confirmDelete', league);
};

const toggleActive = async (leagueId: number): Promise<void> => {
  await viewModel.toggleLeagueStatus(leagueId);
};

const toggleVisible = async (leagueId: number): Promise<void> => {
  await viewModel.toggleLeagueVisibility(leagueId);
};

// Lifecycle
onMounted(async () => {
  await viewModel.loadLeagues();
});
</script>
