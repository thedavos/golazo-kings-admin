<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center"> Golazo Kings Manager </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          :icon="isDark ? 'light_mode' : 'nights_stay'"
          @click="toggleDarkMode"
          aria-label="Toggle Dark Mode"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useDarkMode } from 'src/composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
</script>
