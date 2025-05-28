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
        <q-btn color="primary" icon="workspaces" label="Scrapear Equipos" />
        <q-btn color="secondary" icon="person" label="Scrapear Jugadores" />
      </div>
    </div>

    <!-- Scraping Type Tabs -->
    <q-card class="q-mb-lg">
      <q-tabs
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="teams" icon="sports_soccer" label="Equipos" />
        <q-tab name="players" icon="person" label="Jugadores" />
        <q-tab name="history" icon="history" label="Historial" />
      </q-tabs>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
