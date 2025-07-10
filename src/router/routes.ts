import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/modules/auth/presentation/layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('src/modules/auth/presentation/pages/LoginPage.vue') },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/leagues',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LeaguesPage.vue') },
      {
        name: 'league-teams',
        path: ':leagueId/teams',
        component: () => import('src/modules/teams/presentation/pages/TeamsPage.vue'),
      },
    ],
  },

  {
    path: '/teams',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/modules/teams/presentation/pages/TeamsPage.vue'),
      },
    ],
  },

  {
    path: '/scraping',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ScrapingPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
