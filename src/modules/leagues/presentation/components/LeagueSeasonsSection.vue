<template>
  <div class="league-seasons-section">
    <!-- Empty state -->
    <div v-if="!league.seasons.length" class="empty-state text-center q-pa-xl">
      <q-icon name="event_busy" size="4rem" color="grey-4" />
      <h6 class="q-mt-md q-mb-sm">No hay temporadas</h6>
      <p class="text-grey-6">Esta liga aún no tiene temporadas creadas.</p>
      <q-btn
        color="primary"
        icon="add"
        label="Crear Primera Temporada"
        @click="$emit('add-season')"
      />
    </div>

    <!-- Seasons content -->
    <template v-else>
      <div class="row q-mb-md justify-between items-center">
        <div class="col-auto">
          <div class="text-h6">{{ league.seasons.length }} Temporadas</div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" icon="add" label="Nueva Temporada" @click="$emit('add-season')" />
        </div>
      </div>

      <q-card class="seasons-card">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-subtitle1">
                <q-icon name="info" size="sm" class="q-mr-xs" />
                Temporada activa:
                <span v-if="hasActiveSeason" class="text-positive">
                  {{ activeSeason?.name || 'Temporada sin nombre' }}
                </span>
                <span v-else class="text-grey"> No hay temporada activa </span>
              </div>
            </div>
          </div>

          <season-timeline
            :seasons="sortedSeasons"
            @view-season="$emit('view-season', $event)"
            @edit-season="$emit('edit-season', $event)"
            @activate-season="$emit('activate-season', $event)"
            @deactivate-season="$emit('deactivate-season', $event)"
          />
        </q-card-section>
      </q-card>

      <!-- Season Stats Summary -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Resumen de Temporadas</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat bordered class="stats-card text-center">
                <q-card-section>
                  <q-icon name="event" size="2rem" color="primary" />
                  <div class="text-h4 q-mt-sm">{{ league.seasons.length }}</div>
                  <div class="text-grey-6">Temporadas Totales</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat bordered class="stats-card text-center">
                <q-card-section>
                  <q-icon name="check_circle" size="2rem" color="positive" />
                  <div class="text-h4 q-mt-sm">{{ activeSeasonCount }}</div>
                  <div class="text-grey-6">Temporadas Activas</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat bordered class="stats-card text-center">
                <q-card-section>
                  <q-icon name="history" size="2rem" color="deep-orange" />
                  <div class="text-h4 q-mt-sm">{{ completedSeasonCount }}</div>
                  <div class="text-grey-6">Temporadas Completadas</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat bordered class="stats-card text-center">
                <q-card-section>
                  <q-icon name="calendar_today" size="2rem" color="info" />
                  <div class="text-h4 q-mt-sm">{{ averageSeasonDuration }}</div>
                  <div class="text-grey-6">Duración Media (días)</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SeasonTimeline from './SeasonTimeline.vue';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  league: League;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'add-season'): void;
  (e: 'view-season', seasonId: number): void;
  (e: 'edit-season', seasonId: number): void;
  (e: 'activate-season', seasonId: number): void;
  (e: 'deactivate-season', seasonId: number): void;
}>();

// Sort seasons by start date (most recent first)
const sortedSeasons = computed(() => {
  return [...props.league.seasons].sort((a, b) => {
    // If both have start dates, sort by date
    if (a.startDate && b.startDate) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }

    // If only one has a start date, prioritize the one with a date
    if (a.startDate && !b.startDate) return -1;
    if (!a.startDate && b.startDate) return 1;

    // If neither has a start date, sort by ID (most recent first)
    return b.id - a.id;
  });
});

// Check if there's an active season
const hasActiveSeason = computed(() => {
  return props.league.seasons.some((season) => season.isActive);
});

// Get the active season
const activeSeason = computed(() => {
  return props.league.seasons.find((season) => season.isActive);
});

// Count of active seasons
const activeSeasonCount = computed(() => {
  return props.league.seasons.filter((season) => season.isActive).length;
});

// Count of completed seasons (has end date in the past)
const completedSeasonCount = computed(() => {
  const now = new Date();
  return props.league.seasons.filter((season) => {
    return season.endDate && new Date(season.endDate) < now;
  }).length;
});

// Average season duration in days
const averageSeasonDuration = computed(() => {
  const seasonsWithDates = props.league.seasons.filter(
    (season) => season.startDate && season.endDate,
  );

  if (!seasonsWithDates.length) return 0;

  const totalDays = seasonsWithDates.reduce((sum, season) => {
    const start = new Date(season.startDate!);
    const end = new Date(season.endDate!);
    const durationMs = end.getTime() - start.getTime();
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    return sum + durationDays;
  }, 0);

  return Math.round(totalDays / seasonsWithDates.length);
});
</script>
