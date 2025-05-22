<template>
  <q-layout view="lHh Lpr lFf" class="q-layout--standard"> <q-header class="q-header fixed-top q-dark shadow_custom q-mx-lg q-mt-md q-py-sm" style="right: 8px; border-radius: 4px;">
    <q-toolbar class="q-toolbar row no-wrap items-center no-shadow">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        class="q-btn--flat q-btn--round text-grey q-btn--actionable q-focusable q-hoverable q-btn--dense custom-border"
      />

      <q-toolbar-title class="q-toolbar__title ellipsis q-ml-sm">
        <q-input
          v-model="searchText"
          placeholder="Search"
          dense
          borderless
          dark
          class="q-field--dark custom-border q-pl-sm"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-8 q-pr-sm" />
          </template>
        </q-input>
      </q-toolbar-title>

      <div>
        <q-btn flat round dense icon="nights_stay" class="q-mr-xs text-grey-6" />
        <q-btn flat round dense class="q-ml-xs q-py-xs q-px-sm custom-border" href="https://github.com/sponsors/mayank091193" target="_blank">
          <q-icon name="favorite" style="color: rgb(235, 93, 170);" />
        </q-btn>
      </div>
      <div class="q-mx-sm">
        <q-btn flat round dense icon="notifications" class="q-mr-md q-py-xs q-px-sm custom-border text-grey" />
        <q-avatar cursor-pointer>
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" alt="avatar" >
        </q-avatar>
      </div>
      <div class="q-mx-sm">
        <q-btn outline label="Buy" href="mailto:mayank091193@gmail.com" class="text-purple text-capitalize" />
      </div>

    </q-toolbar>
  </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      dark
      :width="260"
      :mini="!leftDrawerOpen && $q.screen.gt.sm"
      class="q-drawer--left q-drawer--dark q-dark q-layout--prevent-focus fixed"
    >
      <q-scroll-area class="fit q-scrollarea--dark scroll"> <q-list class="q-list q-list--dark q-list--padding">
        <q-item-label header class="q-toolbar row no-wrap items-center cursor-pointer" style="margin-top: 15px; color: rgb(86, 106, 127);">
          <q-avatar rounded-borders icon="rocket_launch" style="font-size: 38px; color: rgb(105, 108, 255);" />
          <div class="q-toolbar__title ellipsis text-weight-medium q-ml-sm" style="font-size: 1.4rem; letter-spacing: -0.5px;"> Admin CRM </div>
        </q-item-label>

        <q-item
          v-for="link in menuLinks"
          :key="link.title"
          clickable
          :to="link.link"
          :active-class="'tab-active'"
          class="q-item q-item-type row no-wrap q-item--dark q-item--clickable q-link cursor-pointer q-focusable q-hoverable navigation-item q-mx-sm q-mt-xs"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            {{ link.title }}
          </q-item-section>
        </q-item>

        <q-separator class="q-separator q-separator--horizontal q-separator--dark q-my-md q-mx-lg" />

        <q-item
          v-for="link in secondaryMenuLinks"
          :key="link.title"
          clickable
          :to="link.link"
          :active-class="'tab-active'"
          class="q-item q-item-type row no-wrap q-item--dark q-item--clickable q-link cursor-pointer q-focusable q-hoverable navigation-item q-mx-sm q-mt-xs"
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

const $q = useQuasar();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Datos para los links del menú (esto podría venir de una store o ser estático aquí)
const menuLinks = [
  { title: 'Analytics', icon: 'inbox', link: '/' },
  { title: 'CRM', icon: 'star', link: '/crm' },
  { title: 'Customer List', icon: 'people', link: '/customer_list' },
  { title: 'Employee Salary List', icon: 'list', link: '/employee_salary_list' },
  { title: 'Sales Invoices', icon: 'attach_money', link: '/sales_invoices' },
  { title: 'Change Requests', icon: 'send', link: '/change_request' },
  { title: 'Quotes', icon: 'money', link: '/quotes' },
  { title: 'Transactions', icon: 'assignment', link: '/transactions' },
  { title: 'Department', icon: 'business', link: '/department' },
];

const secondaryMenuLinks = [
  { title: 'Charts', icon: 'bar_chart', link: '/charts' },
  { title: 'Calendar', icon: 'event', link: '/calendar' },
]

// Estado para el texto de búsqueda (ejemplo)
const searchText = ref('');

</script>

<style scoped>
/* Puedes re-aplicar o importar los estilos personalizados del HTML original aquí */
/* Por ejemplo: */
.shadow_custom {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* O el box-shadow exacto del HTML */
}
.custom-border {
  border: 1px solid rgba(255, 255, 255, 0.1); /* Ejemplo, ajusta según el HTML */
  border-radius: 4px;
}
.navigation-item {
  border-radius: 4px; /* Parece tener un borde redondeado */
}

</style>
