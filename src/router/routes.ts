import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/leagues',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LeaguesPage.vue') }],
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
