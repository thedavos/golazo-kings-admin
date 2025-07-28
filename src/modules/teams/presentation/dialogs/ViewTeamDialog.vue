<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="team-detail-dialog"
  >
    <q-card class="full-height">
      <!-- Header with breadcrumbs -->
      <q-card-section class="row items-center q-pa-md bg-primary">
        <div class="row items-center">
          <q-breadcrumbs>
            <q-breadcrumbs-el class="text-secondary" icon="home" to="/dashboard" label="Inicio" />
            <q-breadcrumbs-el class="text-secondary" icon="groups" to="/teams" label="Equipos" />
            <q-breadcrumbs-el class="text-white" :label="viewTeam?.name || 'Detalles del Equipo'" />
          </q-breadcrumbs>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <template v-if="viewTeam">
        <!-- Hero Section -->
        <team-hero-section :team="viewTeam" @edit="editTeam" @view-players="viewPlayers" />

        <!-- Tabs Content -->
        <q-card-section class="q-pa-none">
          <q-tabs v-model="activeTab" class="text-grey-7" align="left" narrow-indicator dense>
            <q-tab name="general" label="General" />
            <q-tab name="players" label="Jugadores" />
            <q-tab name="stats" label="Estadísticas" />
            <q-tab name="history" label="Historial" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general" class="q-pa-md">
              <team-general-info :team="viewTeam" />
            </q-tab-panel>

            <!-- Players Tab -->
            <q-tab-panel name="players" class="q-pa-md">
              <team-players-section
                :team-id="viewTeam.id"
                @add-player="addPlayer"
                @view-player="viewPlayer"
                @edit-player="editPlayer"
                @remove-player="removePlayer"
              />
            </q-tab-panel>

            <!-- Stats Tab -->
            <q-tab-panel name="stats" class="q-pa-md">
              <team-stats-section :team="viewTeam" />
            </q-tab-panel>

            <!-- History Tab -->
            <q-tab-panel name="history" class="q-pa-md">
              <team-history-section :team="viewTeam" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </template>

      <!-- Loading state -->
      <template v-else>
        <div class="column items-center justify-center q-pa-xl">
          <q-spinner size="3rem" color="primary" />
          <div class="text-subtitle1 q-mt-md">Cargando información del equipo...</div>
        </div>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import TeamHeroSection from '../components/TeamHeroSection.vue';
import TeamGeneralInfo from '../components/TeamGeneralInfo.vue';
import TeamPlayersSection from '../components/TeamPlayersSection.vue';
import TeamStatsSection from '../components/TeamStatsSection.vue';
import TeamHistorySection from '../components/TeamHistorySection.vue';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

interface Props {
  modelValue: boolean;
  viewTeam: Team;
}

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'edit'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const notifications = useQuasarNotifications();

// State
const activeTab = ref('general');

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Methods
const close = () => {
  emit('close');
};

const editTeam = () => {
  emit('edit');
};

// Player actions
const viewPlayers = () => {
  activeTab.value = 'players';
};

const addPlayer = () => {
  notifications.notifyInfo('Funcionalidad para agregar jugador pendiente de implementación');
};

const viewPlayer = (playerId: number) => {
  notifications.notifyInfo(`Ver jugador con ID: ${playerId}`);
};

const editPlayer = (playerId: number) => {
  notifications.notifyInfo(`Editar jugador con ID: ${playerId}`);
};

const removePlayer = (playerId: number) => {
  notifications.notifyInfo(`Eliminar jugador con ID: ${playerId}`);
};
</script>
