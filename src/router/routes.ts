import type { RouteRecordRaw } from 'vue-router';

const addAuthMeta = () => ({
  meta: {
    requiresAuth: true,
  },
});

const addDashboardRoute = (path: string) => ({
  path,
  component: () => import('layouts/MainLayout.vue'),
  children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  ...addAuthMeta(),
});

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/modules/auth/presentation/layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('src/modules/auth/presentation/pages/LoginPage.vue') },
    ],
  },
  addDashboardRoute('/'),
  addDashboardRoute('/dashboard'),

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
        name: 'team-details-by-uuid',
        path: ':uuid?',
        component: () => import('src/modules/teams/presentation/pages/TeamsPage.vue'),
      },
      {
        name: 'team-details',
        path: 'slug/:teamSlug',
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

  {
    path: '/players',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/modules/players/presentation/pages/PlayersPage.vue'),
      },
      {
        name: 'player-details',
        path: ':playerSlug',
        component: () => import('src/modules/players/presentation/pages/PlayersPage.vue'),
      },
    ],
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
