<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="league-detail-dialog"
  >
    <q-card class="full-height">
      <!-- Header with breadcrumbs and close -->
      <q-card-section class="row items-center q-pa-md bg-primary">
        <div class="row items-center">
          <q-breadcrumbs>
            <q-breadcrumbs-el class="text-secondary" icon="home" to="/dashboard" label="Inicio" />
            <q-breadcrumbs-el
              class="text-secondary"
              icon="sports_soccer"
              to="/leagues"
              label="Ligas"
            />
            <q-breadcrumbs-el
              class="text-white"
              :label="viewLeague?.name || 'Detalles de la Liga'"
            />>
          </q-breadcrumbs>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <template v-if="viewLeague">
        <!-- Hero Section -->
        <league-hero-section :league="viewLeague" @edit="editLeague" @view-teams="viewTeams" />

        <!-- Tabs Content -->
        <q-card-section class="q-pa-none">
          <q-tabs v-model="activeTab" class="text-grey-7" align="left" narrow-indicator dense>
            <q-tab name="general" label="General" />
            <q-tab name="teams" label="Equipos" />
            <q-tab name="seasons" label="Temporadas" />
            <q-tab name="stats" label="Estadísticas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general" class="q-pa-md">
              <league-general-info :league="viewLeague" />
            </q-tab-panel>

            <!-- Teams Tab -->
            <q-tab-panel name="teams" class="q-pa-md">
              <league-teams-section
                :league-id="viewLeague.id"
                @add-team="addTeam"
                @view-team="viewTeam"
                @edit-team="editTeam"
                @remove-team="removeTeam"
              />
            </q-tab-panel>

            <!-- Seasons Tab -->
            <q-tab-panel name="seasons" class="q-pa-md">
              <league-seasons-section
                :league="viewLeague"
                @add-season="addSeason"
                @view-season="viewSeason"
                @edit-season="editSeason"
                @activate-season="activateSeason"
                @deactivate-season="deactivateSeason"
              />
            </q-tab-panel>

            <!-- Stats Tab -->
            <q-tab-panel name="stats" class="q-pa-md">
              <league-stats-section :league="viewLeague" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </template>

      <!-- Loading state -->
      <template v-else>
        <div class="column items-center justify-center q-pa-xl">
          <q-spinner size="3rem" color="primary" />
          <div class="text-subtitle1 q-mt-md">Cargando información de la liga...</div>
        </div>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import LeagueHeroSection from '../components/LeagueHeroSection.vue';
import LeagueGeneralInfo from '../components/LeagueGeneralInfo.vue';
import LeagueTeamsSection from '../components/LeagueTeamsSection.vue';
import LeagueSeasonsSection from '../components/LeagueSeasonsSection.vue';
import LeagueStatsSection from '../components/LeagueStatsSection.vue';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  modelValue: boolean;
  viewLeague: League;
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

const editLeague = () => {
  emit('edit');
};

// Team actions
const viewTeams = () => {
  activeTab.value = 'teams';
};

const addTeam = () => {
  notifications.notifyInfo('Funcionalidad para agregar equipo pendiente de implementación');
};

const viewTeam = (teamId: number) => {
  notifications.notifyInfo(`Ver equipo con ID: ${teamId}`);
};

const editTeam = (teamId: number) => {
  notifications.notifyInfo(`Editar equipo con ID: ${teamId}`);
};

const removeTeam = (teamId: number) => {
  notifications.notifyInfo(`Eliminar equipo con ID: ${teamId}`);
};

// Season actions
const addSeason = () => {
  notifications.notifyInfo('Funcionalidad para agregar temporada pendiente de implementación');
};

const viewSeason = (seasonId: number) => {
  notifications.notifyInfo(`Ver temporada con ID: ${seasonId}`);
};

const editSeason = (seasonId: number) => {
  notifications.notifyInfo(`Editar temporada con ID: ${seasonId}`);
};

const activateSeason = (seasonId: number) => {
  notifications.notifyInfo(`Activar temporada con ID: ${seasonId}`);
};

const deactivateSeason = (seasonId: number) => {
  notifications.notifyInfo(`Desactivar temporada con ID: ${seasonId}`);
};
</script>
