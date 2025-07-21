import type { RouteRecordRaw } from 'vue-router';

const addAuthMeta = () => ({
  meta: {
    requiresAuth: true,
  },
});

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/modules/auth/presentation/layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('src/modules/auth/presentation/pages/LoginPage.vue') },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    ...addAuthMeta(),
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
    ...addAuthMeta(),
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
    ...addAuthMeta(),
  },

  {
    path: '/scraping',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ScrapingPage.vue') }],
    ...addAuthMeta(),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
