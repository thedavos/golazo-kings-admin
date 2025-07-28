<template>
  <div class="team-players-section">
    <!-- Header with actions -->
    <div class="row items-center justify-between q-mb-md">
      <h5 class="text-h5 q-my-none">Jugadores</h5>
      <q-btn color="primary" icon="add" label="Agregar Jugador" @click="$emit('add-player')" />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="column items-center justify-center q-pa-xl">
      <q-spinner size="3rem" color="primary" />
      <div class="text-subtitle1 q-mt-md">Cargando jugadores...</div>
    </div>

    <!-- Empty state -->
    <q-card v-else-if="players && !players.length" flat bordered class="text-center q-pa-lg">
      <q-icon name="sports_soccer" size="4rem" color="grey-5" />
      <div class="text-h6 q-mt-md">No hay jugadores en este equipo</div>
      <div class="text-grey-6 q-mb-md">Agrega jugadores para verlos aquí</div>
      <q-btn color="primary" icon="add" label="Agregar Jugador" @click="$emit('add-player')" />
    </q-card>

    <!-- Players list -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="player in players" :key="player.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="player-card">
          <q-card-section horizontal>
            <q-card-section class="q-pr-none" style="width: 100px">
              <q-avatar size="80px" class="player-avatar">
                <img v-if="player.photoUrl" :src="player.photoUrl" :alt="player.name" />
                <q-icon v-else name="person" />
              </q-avatar>
            </q-card-section>

            <q-card-section>
              <div class="text-h6">{{ player.name }}</div>
              <div class="text-subtitle2">{{ player.position || 'Sin posición' }}</div>
              <div class="text-caption text-grey-7">
                {{ player.nationality || 'Nacionalidad no especificada' }}
              </div>

              <div class="row items-center q-mt-sm">
                <q-chip v-if="player.number" dense size="sm" color="primary" text-color="white">
                  #{{ player.number }}
                </q-chip>
                <q-chip v-if="player.role" dense size="sm" color="secondary" text-color="white">
                  {{ player.role }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat dense icon="visibility" @click="$emit('view-player', player.id)">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="edit" @click="$emit('edit-player', player.id)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(player)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmar eliminación</span>
        </q-card-section>

        <q-card-section>
          <p>
            ¿Estás seguro de que quieres eliminar al jugador
            <strong>{{ playerToDelete?.name }}</strong
            >?
          </p>
          <p class="text-caption text-grey-6">Esta acción no se puede deshacer.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn color="negative" label="Eliminar" :loading="deleteLoading" @click="deletePlayer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';

// This is a mock interface for Player, replace with actual Player entity when available
interface Player {
  id: number;
  name: string;
  position?: string;
  nationality?: string;
  number?: number;
  role?: string;
  photoUrl?: string;
}

interface Props {
  teamId: number;
  players?: Player[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  players: () => [],
  loading: false,
});

const emit = defineEmits<{
  (e: 'add-player'): void;
  (e: 'view-player', playerId: number): void;
  (e: 'edit-player', playerId: number): void;
  (e: 'remove-player', playerId: number): void;
}>();

const notifications = useQuasarNotifications();

// Delete confirmation
const showDeleteDialog = ref(false);
const deleteLoading = ref(false);
const playerToDelete = ref<Player | null>(null);

const confirmDelete = (player: Player) => {
  playerToDelete.value = player;
  showDeleteDialog.value = true;
};

const deletePlayer = async () => {
  if (!playerToDelete.value) return;

  try {
    deleteLoading.value = true;
    // Here you would call the actual delete method
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    emit('remove-player', playerToDelete.value.id);
    notifications.notifySuccess(`Jugador ${playerToDelete.value.name} eliminado correctamente`);

    showDeleteDialog.value = false;
    playerToDelete.value = null;
  } catch (error) {
    notifications.notifyError('Error al eliminar el jugador');
    console.error('Error deleting player:', error);
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.team-players-section {
  .player-card {
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    }

    .player-avatar {
      background-color: #f0f0f0;
    }
  }
}
</style>
