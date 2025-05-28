<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-black">
          <q-input v-model="searchText" placeholder="Search" dense dark borderless class="q-pl-sm">
            <template v-slot:prepend>
              <q-icon v-if="searchText === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
            </template>
          </q-input>
        </q-toolbar-title>
        <div>
          <q-btn
            flat
            round
            dense
            :icon="isDark ? 'light_mode' : 'nights_stay'"
            @click="onToggleDarkMode"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :bordered="!isDark"
      :width="260"
      :mini="!leftDrawerOpen && $q.screen.gt.sm"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label
            header
            class="items-center justify-center cursor-pointer text-weight-medium text-h6"
          >
            Golazo Kings Admin
          </q-item-label>

          <q-item
            v-for="link in menuLinks"
            :key="link.title"
            clickable
            :to="link.link"
            :active-class="'tab-active'"
            class="q-mx-sm q-mt-xs"
            exact
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              {{ link.title }}
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md q-mx-lg" />

          <q-item
            v-for="link in secondaryMenuLinks"
            :key="link.title"
            clickable
            :to="link.link"
            :active-class="'tab-active'"
            class="q-mx-sm q-mt-xs"
            exact
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              {{ link.title }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDarkMode } from 'src/composables/useDarkMode';

const searchText = ref('');
const leftDrawerOpen = ref(false);

const $q = useQuasar();
const { isDark, toggleDarkMode } = useDarkMode();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const onToggleDarkMode = () => {
  toggleDarkMode();
};

// Datos para los links del menú (esto podría venir de una store o ser estático aquí)
const menuLinks = [
  { title: 'Ligas', icon: 'apps', link: '/leagues' },
  { title: 'Presidentes', icon: 'emoji_people', link: '/presidents' },
  { title: 'Equipos', icon: 'workspaces', link: '/teams' },
  { title: 'Jugadores', icon: 'groups', link: '/players' },
];

const secondaryMenuLinks = [
  { title: 'Extracción de datos', icon: 'data_exploration', link: '/scraping' },
  { title: 'Configuración', icon: 'settings', link: '/configuration' },
];
</script>
