import { createRouter, createWebHistory } from 'vue-router';
import CalendarView from '@/views/CalendarView.vue';
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/calendar', component: CalendarView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
