<template>
  <div class="team-stats-section">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <h5 class="text-h5 q-my-none">Estadísticas</h5>
      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Actualizar"
        @click="refreshStats"
        :loading="loading"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="column items-center justify-center q-pa-xl">
      <q-spinner size="3rem" color="primary" />
      <div class="text-subtitle1 q-mt-md">Cargando estadísticas...</div>
    </div>

    <!-- Empty state -->
    <q-card v-else-if="!hasStats" flat bordered class="text-center q-pa-lg">
      <q-icon name="insert_chart" size="4rem" color="grey-5" />
      <div class="text-h6 q-mt-md">No hay estadísticas disponibles</div>
      <div class="text-grey-6 q-mb-md">
        Las estadísticas se generarán automáticamente a medida que el equipo participe en partidos
      </div>
    </q-card>

    <!-- Stats content -->
    <div v-else class="row q-col-gutter-md">
      <!-- Season Summary -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="calendar_today" class="q-mr-sm" />
              <p class="q-my-auto">Resumen de Temporada</p>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <q-card flat class="bg-primary text-white text-center q-pa-md">
                  <div class="text-h3">{{ stats.matchesPlayed }}</div>
                  <div class="text-caption">Partidos Jugados</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-positive text-white text-center q-pa-md">
                  <div class="text-h3">{{ stats.wins }}</div>
                  <div class="text-caption">Victorias</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-warning text-white text-center q-pa-md">
                  <div class="text-h3">{{ stats.draws }}</div>
                  <div class="text-caption">Empates</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-negative text-white text-center q-pa-md">
                  <div class="text-h3">{{ stats.losses }}</div>
                  <div class="text-caption">Derrotas</div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Performance Metrics -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="speed" class="q-mr-sm" />
              <p class="q-my-auto">Rendimiento</p>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Puntos</q-item-label>
                    <q-item-label class="text-h5">{{ stats.points }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Posición en Liga</q-item-label>
                    <q-item-label class="text-h5">{{ stats.leaguePosition || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>% Victorias</q-item-label>
                    <q-item-label class="text-h5">{{ winPercentage }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Racha Actual</q-item-label>
                    <q-item-label class="text-h5">{{ stats.currentStreak || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Scoring Stats -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="sports_soccer" class="q-mr-sm" />
              <p class="q-my-auto">Goles</p>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Goles a Favor</q-item-label>
                    <q-item-label class="text-h5">{{ stats.goalsScored }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Goles en Contra</q-item-label>
                    <q-item-label class="text-h5">{{ stats.goalsConceded }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Diferencia de Goles</q-item-label>
                    <q-item-label class="text-h5" :class="goalDifferenceClass">{{
                      goalDifference
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Promedio por Partido</q-item-label>
                    <q-item-label class="text-h5">{{ goalsPerMatch }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Last 5 Matches -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="history" class="q-mr-sm" />
              <p class="q-my-auto">Últimos 5 Partidos</p>
            </div>

            <div
              v-if="stats.lastMatches && stats.lastMatches.length"
              class="row q-col-gutter-sm justify-center"
            >
              <div v-for="(match, index) in stats.lastMatches" :key="index" class="col-auto">
                <q-chip :color="getResultColor(match.result)" text-color="white" size="lg" square>
                  <div class="text-center">
                    <div class="text-body1">{{ match.result }}</div>
                    <div class="text-caption">{{ match.score }}</div>
                  </div>
                </q-chip>
              </div>
            </div>

            <div v-else class="text-center text-grey-6 q-pa-md">No hay partidos recientes</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

// Mock interface for team stats
interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsScored: number;
  goalsConceded: number;
  leaguePosition?: number;
  currentStreak?: string;
  lastMatches?: Array<{
    result: 'W' | 'D' | 'L';
    score: string;
    opponent: string;
    date: string;
  }>;
}

interface Props {
  team: Team;
}

defineProps<Props>();

const notifications = useQuasarNotifications();
const loading = ref(false);

// Mock stats data - in a real implementation, this would come from an API
const stats = ref<TeamStats>({
  matchesPlayed: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  points: 0,
  goalsScored: 0,
  goalsConceded: 0,
  lastMatches: [],
});

const hasStats = computed(() => {
  return stats.value.matchesPlayed > 0;
});

const winPercentage = computed(() => {
  if (stats.value.matchesPlayed === 0) return 0;
  return Math.round((stats.value.wins / stats.value.matchesPlayed) * 100);
});

const goalDifference = computed(() => {
  return stats.value.goalsScored - stats.value.goalsConceded;
});

const goalDifferenceClass = computed(() => {
  if (goalDifference.value > 0) return 'text-positive';
  if (goalDifference.value < 0) return 'text-negative';
  return '';
});

const goalsPerMatch = computed(() => {
  if (stats.value.matchesPlayed === 0) return '0.0';
  return (stats.value.goalsScored / stats.value.matchesPlayed).toFixed(1);
});

const getResultColor = (result: 'W' | 'D' | 'L') => {
  switch (result) {
    case 'W':
      return 'positive';
    case 'D':
      return 'warning';
    case 'L':
      return 'negative';
    default:
      return 'grey';
  }
};

const loadStats = async () => {
  loading.value = true;

  try {
    // In a real implementation, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data for demonstration
    stats.value = {
      matchesPlayed: 10,
      wins: 6,
      draws: 2,
      losses: 2,
      points: 20,
      goalsScored: 18,
      goalsConceded: 10,
      leaguePosition: 3,
      currentStreak: 'W3',
      lastMatches: [
        { result: 'W', score: '2-1', opponent: 'Team A', date: '2025-07-15' },
        { result: 'W', score: '3-0', opponent: 'Team B', date: '2025-07-08' },
        { result: 'W', score: '1-0', opponent: 'Team C', date: '2025-07-01' },
        { result: 'D', score: '2-2', opponent: 'Team D', date: '2025-06-24' },
        { result: 'L', score: '0-2', opponent: 'Team E', date: '2025-06-17' },
      ],
    };
  } catch (error) {
    notifications.notifyError('Error al cargar las estadísticas');
    console.error('Error loading stats:', error);
  } finally {
    loading.value = false;
  }
};

const refreshStats = async () => {
  await loadStats();
};

onMounted(async () => {
  await loadStats();
});
</script>

<style lang="scss" scoped>
.team-stats-section {
  .q-card {
    height: 100%;
  }
}
</style>
