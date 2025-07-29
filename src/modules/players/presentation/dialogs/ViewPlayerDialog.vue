<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="player-detail-dialog"
  >
    <q-card class="full-height">
      <!-- Header with breadcrumbs -->
      <q-card-section class="row items-center q-pa-md bg-primary">
        <div class="row items-center">
          <q-breadcrumbs>
            <q-breadcrumbs-el class="text-secondary" icon="home" to="/dashboard" label="Inicio" />
            <q-breadcrumbs-el
              class="text-secondary"
              icon="people"
              to="/players"
              label="Jugadores"
            />
            <q-breadcrumbs-el
              class="text-white"
              :label="viewPlayer?.fullName || 'Detalles del Jugador'"
            />
          </q-breadcrumbs>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <template v-if="viewPlayer">
        <!-- Hero Section -->
        <player-hero-section :player="viewPlayer" @edit="editPlayer" @view-team="viewTeam" />

        <!-- Tabs Content -->
        <q-card-section class="q-pa-none">
          <q-tabs v-model="activeTab" class="text-grey-7" align="left" narrow-indicator dense>
            <q-tab name="general" label="General" />
            <q-tab name="stats" label="Estadísticas" />
            <q-tab name="matches" label="Partidos" />
            <q-tab name="history" label="Historial" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general" class="q-pa-md">
              <player-general-info :player="viewPlayer" />
            </q-tab-panel>

            <!-- Stats Tab -->
            <q-tab-panel name="stats" class="q-pa-md">
              <player-stats-section :player="viewPlayer" />
            </q-tab-panel>

            <!-- Matches Tab -->
            <q-tab-panel name="matches" class="q-pa-md">
              <player-matches-section :player-id="viewPlayer.id" />
            </q-tab-panel>

            <!-- History Tab -->
            <q-tab-panel name="history" class="q-pa-md">
              <player-history-section :player="viewPlayer" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </template>

      <!-- Loading state -->
      <template v-else>
        <div class="column items-center justify-center q-pa-xl">
          <q-spinner size="3rem" color="primary" />
          <div class="text-subtitle1 q-mt-md">Cargando información del jugador...</div>
        </div>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouteQuery } from '@vueuse/router';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import PlayerHeroSection from '../components/PlayerHeroSection.vue';
import PlayerGeneralInfo from '../components/PlayerGeneralInfo.vue';
import PlayerStatsSection from '../components/PlayerStatsSection.vue';
import PlayerMatchesSection from '../components/PlayerMatchesSection.vue';
import PlayerHistorySection from '../components/PlayerHistorySection.vue';
import type { Player } from 'src/modules/players/domain/entities/player.entity';

interface Props {
  modelValue: boolean;
  viewPlayer: Player;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'edit'): void;
  (e: 'view-team', teamUuid: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const notifications = useQuasarNotifications();

const activeTab = useRouteQuery('tab', 'general');

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Methods
const close = () => {
  emit('close');
};

const editPlayer = () => {
  emit('edit');
};

const viewTeam = () => {
  if (props.viewPlayer.teamId) {
    emit('view-team', props.viewPlayer.teamUuid);
  } else {
    notifications.notifyInfo('El jugador no tiene un equipo asignado');
  }
};
</script>

<style lang="scss" scoped>
.player-detail-dialog {
  .q-dialog__inner > div {
    max-height: 100vh;
  }
}
</style>
