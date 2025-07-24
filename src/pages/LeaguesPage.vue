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
    <LeagueStatCards
      class="row q-gutter-md q-mb-lg"
      :total-leagues="viewModel.totalLeagues.value"
      :active-leagues="viewModel.activeLeagues.value"
      :visible-leagues="viewModel.visibleLeagues.value"
      :countries="viewModel.countries.value.length"
    />

    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="viewModel.filters.value.search"
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
            v-model="viewModel.filters.value.country"
            :options="countryOptions"
            label="País"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="viewModel.filters.value.status"
            :options="statusOptions"
            label="Estado"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="viewModel.filters.value.isActive"
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
        :rows="viewModel.leagues.value"
        :columns="columns"
        :loading="viewModel.loadings.value.list"
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
            <q-btn-dropdown flat dense rounded no-icon-animation dropdown-icon="more_vert">
              <q-list padding separator>
                <q-item clickable v-close-popup @click="viewLeague(props.row)">
                  <q-item-section>
                    <q-item-label>Ver detalles</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="viewLeagueTeams(props.row)">
                  <q-item-section>
                    <q-item-label>Ver equipos</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editLeague(props.row)">
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="confirmDelete(props.row)">
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

    <view-league-dialog
      v-if="leagueToView"
      :model-value="showDetailsDialog"
      :view-league="leagueToView"
      @close="onCloseViewDialog"
      @edit="editLeague(leagueToView)"
    />

    <create-league-dialog
      v-model="showCreateDialog"
      :loading="viewModel.loadings.value.create"
      @submit="onCreateLeague"
      @close="onCloseCreateDialog"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';
import { getStatusColor } from 'src/modules/leagues/presentation/utils/getStatusColor.utils';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';

import LeagueStatCards from 'src/modules/leagues/presentation/components/LeagueStatCards.vue';
import ViewLeagueDialog from 'src/modules/leagues/presentation/dialogs/ViewLeagueDialog.vue';
import CreateLeagueDialog from 'src/modules/leagues/presentation/dialogs/CreateLeagueDialog.vue';

const router = useRouter();
const viewModel = useLeagueViewModel();

// Dialog states
const showCreateDialog = ref(false);
const showDetailsDialog = ref(false);
// const showDeleteDialog = ref(false);

// Form state
// const editingLeague = ref<League | null>(null);
// const leagueToDelete = ref<League | null>(null);
const leagueToView = ref<League | null>(null);

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
const viewLeague = (league: League) => {
  showDetailsDialog.value = true;
  leagueToView.value = league;
};

const viewLeagueTeams = async (league: League) => {
  await router.push({ name: 'league-teams', params: { leagueId: league.id } });
};

const editLeague = (league: League) => {
  console.log('editLeague: ', league);
};

const confirmDelete = (league: League) => {
  console.log('confirmDelete: ', league);
};

const onCloseViewDialog = () => {
  showDetailsDialog.value = false;
  leagueToView.value = null;
};

const toggleActive = async (leagueId: number): Promise<void> => {
  await viewModel.toggleLeagueStatus(leagueId);
};

const toggleVisible = async (leagueId: number): Promise<void> => {
  await viewModel.toggleLeagueVisibility(leagueId);
};

const onCreateLeague = async (leagueData: CreateLeagueDto): Promise<void> => {
  try {
    await viewModel.createLeague(leagueData);
    showCreateDialog.value = false;
    await viewModel.loadLeagues();
  } catch (error) {
    console.error('Error creating league:', error);
  }
};

const onCloseCreateDialog = (): void => {
  showCreateDialog.value = false;
};
</script>
