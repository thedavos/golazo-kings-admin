<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none">Jugadores</h4>
        <p class="text-grey-6">Administra todos los jugadores de las ligas</p>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Nuevo Jugador"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Stats Cards -->
    <player-stat-cards
      class="q-mb-lg"
      :total-players="playerStore.totalPlayers"
      :active-players="playerStore.activePlayers"
      :inactive-players="playerStore.inactivePlayers"
      :wildcard-players="wildcardPlayers"
    />

    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <q-input
            v-model="playerStore.filters.search"
            label="Buscar jugador"
            outlined
            dense
            class="col-md-3 col-sm-6 col-xs-12"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="playerStore.filters.teamId"
            :options="teamOptions"
            label="Equipo"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="playerStore.filters.position"
            :options="positionOptions"
            label="Posición"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="playerStore.filters.nationality"
            :options="nationalityOptions"
            label="Nacionalidad"
            outlined
            dense
            clearable
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-select
            v-model="playerStore.filters.isActive"
            :options="statusOptions"
            label="Estado"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="col-md-2 col-sm-6 col-xs-12"
          />

          <q-btn
            color="grey-6"
            flat
            icon="clear"
            label="Limpiar filtros"
            @click="playerStore.clearFilters"
            class="col-auto"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Players Table -->
    <q-card>
      <q-table
        :rows="playerStore.players"
        :columns="columns"
        :loading="playerStore.loadings.list"
        row-key="id"
        :pagination="{ rowsPerPage: 15 }"
        flat
        bordered
      >
        <!-- Photo column -->
        <template v-slot:body-cell-photo="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.profileImageUrl" size="40px">
              <q-img
                fit="cover"
                :src="props.row.profileImageUrl"
                :alt="props.row.fullName"
                @error="onImageError"
              />
            </q-avatar>
            <q-avatar v-else color="grey-4" text-color="grey-8" icon="person" size="40px" />
          </q-td>
        </template>

        <!-- Player info column -->
        <template v-slot:body-cell-player="props">
          <q-td :props="props">
            <div>
              <div class="text-weight-bold">{{ props.row.fullName }}</div>
              <div class="text-grey-6 text-caption">{{ props.row.nickname || 'Sin apodo' }}</div>
            </div>
          </q-td>
        </template>

        <!-- Team column -->
        <template v-slot:body-cell-team="props">
          <q-td :props="props">
            <q-chip
              v-if="props.row.teamId"
              color="info"
              text-color="white"
              :label="getTeamName(props.row.teamId)"
              size="sm"
            />
            <span v-else class="text-grey-6">Sin equipo</span>
          </q-td>
        </template>

        <!-- Position column -->
        <template v-slot:body-cell-position="props">
          <q-td :props="props">
            <q-badge
              v-if="props.row.position"
              :color="getPositionColor(props.row.position)"
              :label="props.row.position"
            />
            <span v-else class="text-grey-6">-</span>
          </q-td>
        </template>

        <!-- Jersey column -->
        <template v-slot:body-cell-jersey="props">
          <q-td :props="props">
            <div v-if="props.row.jerseyNumber" class="text-center">
              <q-chip
                color="primary"
                text-color="white"
                :label="`#${props.row.jerseyNumber}`"
                size="sm"
              />
            </div>
            <span v-else class="text-grey-6">-</span>
          </q-td>
        </template>

        <!-- Age column -->
        <template v-slot:body-cell-age="props">
          <q-td :props="props"> {{ props.row.age || '-' }} {{ props.row.age ? 'años' : '' }} </q-td>
        </template>

        <!-- Status column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.isActive ? 'positive' : 'negative'"
              text-color="white"
              :label="props.row.isActive ? 'Activo' : 'Inactivo'"
              size="sm"
            />
          </q-td>
        </template>

        <!-- Actions column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown flat dense rounded no-icon-animation dropdown-icon="more_vert">
              <q-list padding separator>
                <q-item clickable v-close-popup @click="viewPlayer(props.row)">
                  <q-item-section>
                    <q-item-label>Ver detalles</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="viewPlayerTeam(props.row)">
                  <q-item-section>
                    <q-item-label>Ver equipo</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editPlayer(props.row)">
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
    <view-player-dialog
      v-if="playerToView"
      v-model="showDetailsDialog"
      :view-player="playerToView"
      @close="onCloseViewDialog"
      @edit="onEditFromView"
      @view-team="onViewTeam"
    />

    <create-player-dialog
      v-model="showCreateDialog"
      @close="onCloseCreateDialog"
      @created="onPlayerCreated"
    />

    <edit-player-dialog
      v-if="playerToEdit"
      v-model="showEditDialog"
      :player="playerToEdit"
      @close="onCloseEditDialog"
      @saved="onPlayerSaved"
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
            ¿Estás seguro de que quieres eliminar al jugador
            <strong>{{ playerToDelete?.fullName }}</strong
            >?
          </p>
          <p class="text-caption text-grey-6">
            Esta acción no se puede deshacer y eliminará todos los datos relacionados.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn
            color="negative"
            label="Eliminar"
            :loading="playerStore.loadings.delete"
            @click="deletePlayer"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePlayerDetailsStore } from 'src/modules/players/stores/playerDetails.store';
import { useTeamViewModel } from 'src/modules/teams/presentation/viewmodels/team.viewmodel';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import PlayerStatCards from '../components/PlayerStatCards.vue';
import ViewPlayerDialog from '../dialogs/ViewPlayerDialog.vue';
import CreatePlayerDialog from '../dialogs/CreatePlayerDialog.vue';
import EditPlayerDialog from '../dialogs/EditPlayerDialog.vue';
import type { QTableProps } from 'quasar';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import type { PlayerPosition } from 'src/modules/players/domain/value-objects/player-position.enum';

// Composables
const router = useRouter();
const playerStore = usePlayerDetailsStore();
const notifications = useQuasarNotifications();
const { teams, loadTeams } = useTeamViewModel();
const { players } = storeToRefs(playerStore);

// State
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDetailsDialog = ref(false);
const showDeleteDialog = ref(false);
const playerToView = ref<Player | null>(null);
const playerToEdit = ref<Player | null>(null);
const playerToDelete = ref<Player | null>(null);

// Options
const teamOptions = computed<{ label: string; value: number }[]>(() =>
  teams.value.map((team) => ({
    label: team.name,
    value: team.id,
  })),
);

const positionOptions = computed(() => {
  if (!players.value?.length) return [];
  const uniquePositions = new Set(
    players.value.map((player) => player.position as PlayerPosition).filter(Boolean),
  );
  return Array.from(uniquePositions).sort();
});

const nationalityOptions = [
  'España',
  'México',
  'Argentina',
  'Colombia',
  'Chile',
  'Brasil',
  'Francia',
  'Alemania',
  'Italia',
  'Portugal',
];

const statusOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
];

// Table columns
const columns: QTableProps['columns'] = [
  { name: 'photo', label: '', field: 'photo', align: 'center', sortable: false },
  { name: 'player', label: 'Jugador', field: 'fullName', align: 'left', sortable: true },
  { name: 'team', label: 'Equipo', field: 'teamId', align: 'left', sortable: true },
  { name: 'position', label: 'Posición', field: 'position', align: 'center', sortable: true },
  { name: 'jersey', label: 'Dorsal', field: 'jerseyNumber', align: 'center', sortable: true },
  { name: 'age', label: 'Edad', field: 'age', align: 'center', sortable: true },
  {
    name: 'nationality',
    label: 'Nacionalidad',
    field: 'nationality',
    align: 'left',
    sortable: true,
  },
  { name: 'status', label: 'Estado', field: 'isActive', align: 'center', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center', sortable: false },
];

// Computed
const wildcardPlayers = computed(
  () => playerStore.players.filter((player) => player.isWildCard).length || 0,
);

// Methods
const getPositionColor = (position: string): string => {
  const colorMap: Record<string, string> = {
    Portero: 'orange',
    'Defensa Central': 'blue',
    'Lateral Derecho': 'blue-6',
    'Lateral Izquierdo': 'blue-6',
    Pivote: 'green',
    Mediocentro: 'green-6',
    'Mediocentro Ofensivo': 'amber',
    'Extremo Derecho': 'purple',
    'Extremo Izquierdo': 'purple',
    'Delantero Centro': 'red',
    'Segundo Delantero': 'red-6',
  };
  return colorMap[position] || 'grey';
};

const getTeamName = (teamId: number): string => {
  const team = teamOptions.value.find((t) => t.value === teamId);
  return team?.label || 'Sin equipo';
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '';
};

// Dialog handlers
const viewPlayer = (player: Player) => {
  playerToView.value = player;
  showDetailsDialog.value = true;
};

const editPlayer = (player: Player) => {
  playerToEdit.value = player;
  showEditDialog.value = true;
};

const confirmDelete = (player: Player) => {
  playerToDelete.value = player;
  showDeleteDialog.value = true;
};

const deletePlayer = async () => {
  if (!playerToDelete.value) return;

  try {
    await playerStore.deletePlayer(playerToDelete.value.id);
    showDeleteDialog.value = false;
    playerToDelete.value = null;
    notifications.notifySuccess('Jugador eliminado exitosamente');
  } catch (error) {
    console.error('Error deleting player:', error);
  }
};

// Close handlers
const onCloseViewDialog = () => {
  showDetailsDialog.value = false;
  playerToView.value = null;
};

const onCloseCreateDialog = () => {
  showCreateDialog.value = false;
};

const onCloseEditDialog = () => {
  showEditDialog.value = false;
  playerToEdit.value = null;
};

const onEditFromView = () => {
  if (playerToView.value) {
    playerToEdit.value = playerToView.value;
    showEditDialog.value = true;
  }
};

const onPlayerCreated = (playerId: number) => {
  notifications.notifySuccess(`Jugador creado exitosamente: ${playerId}`);
};

const onPlayerSaved = (player: Player) => {
  notifications.notifySuccess('Jugador actualizado exitosamente');
  if (playerToView.value?.id === player.id) {
    playerToView.value = player;
  }
};

const viewPlayerTeam = async (player: Player) => {
  if (player.teamUuid) {
    await router.push(`/teams/${player.teamUuid}`);
  } else {
    notifications.notifyInfo('El jugador no tiene un equipo asignado');
  }
};

const onViewTeam = async (teamUuid: string) => {
  await router.push(`/teams/${teamUuid}`);
};

// Initialize
onMounted(async () => {
  await loadTeams();
  await playerStore.playersQuery.refetch();
});
</script>
