<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none">Centro de Scraping</h4>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">
          Gestiona el scraping de equipos y jugadores desde fuentes externas
        </p>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          color="primary"
          icon="workspaces"
          label="Scrapear Equipos"
          @click="openTeamScrapingDialog"
        />
        <q-btn
          color="secondary"
          icon="person"
          label="Scrapear Jugadores"
          @click="openPlayerScrapingDialog"
        />
      </div>
    </div>

    <!-- Scraping Type Tabs -->
    <q-card class="q-mb-lg">
      <q-tabs
        dense
        v-model="activeTab"
        class="text-grey"
        active-color="accent"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="teams" icon="sports_soccer" label="Equipos" />
        <q-tab name="players" icon="person" label="Jugadores" />
        <q-tab name="history" icon="history" label="Historial" />
      </q-tabs>
    </q-card>

    <!-- Dialogs -->
    <TeamScrapingDialog
      v-model="showTeamScrapingDialog"
      :leagues="leagues"
      @scraping-completed="onTeamScrapingCompleted"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// composables
import { useLeagueViewModel } from 'src/modules/leagues/presentation/viewmodels/league.viewmodel';

// components
import TeamScrapingDialog from 'src/modules/scraping/presentation/dialogs/TeamScrapingDialog.vue';

const leagueViewModel = useLeagueViewModel();

// Reactive data
const activeTab = ref('teams');
const showTeamScrapingDialog = ref(false);
const showPlayerScrapingDialog = ref(false);

// Computed
const leagues = computed(() => leagueViewModel.leagues.value);

// Methods
const openTeamScrapingDialog = () => {
  showTeamScrapingDialog.value = true;
};

const openPlayerScrapingDialog = () => {
  showPlayerScrapingDialog.value = true;
};

const onTeamScrapingCompleted = () => {
  // scrapingViewModel.setLastScrapingResult({
  //   ...result,
  //   type: ScrapingType.TEAMS
  // });
  // refreshTeamData();
};

// Lifecycle
onMounted(async () => {
  await Promise.all([leagueViewModel.loadLeagues()]);
});
</script>
