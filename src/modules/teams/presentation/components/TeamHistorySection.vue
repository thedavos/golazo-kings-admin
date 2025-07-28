<template>
  <div class="team-history-section">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <h5 class="text-h5 q-my-none">Historial</h5>
      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Actualizar"
        @click="refreshHistory"
        :loading="loading"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="column items-center justify-center q-pa-xl">
      <q-spinner size="3rem" color="primary" />
      <div class="text-subtitle1 q-mt-md">Cargando historial...</div>
    </div>

    <!-- Empty state -->
    <q-card v-else-if="!hasHistory" flat bordered class="text-center q-pa-lg">
      <q-icon name="history_edu" size="4rem" color="grey-5" />
      <div class="text-h6 q-mt-md">No hay historial disponible</div>
      <div class="text-grey-6 q-mb-md">
        El historial se irá construyendo a medida que el equipo participe en competiciones
      </div>
    </q-card>

    <!-- History content -->
    <div v-else class="row q-col-gutter-md">
      <!-- Seasons Timeline -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="timeline" class="q-mr-sm" />
              <p class="q-my-auto">Temporadas</p>
            </div>

            <q-timeline color="primary">
              <q-timeline-entry
                v-for="season in history.seasons"
                :key="season.year"
                :title="season.name"
                :subtitle="`${season.year}`"
                icon="event"
              >
                <div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Liga</q-item-label>
                          <q-item-label>{{ season.league }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>

                    <div class="col-12 col-md-6">
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Posición Final</q-item-label>
                          <q-item-label>{{ season.finalPosition || 'N/A' }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>

                    <div class="col-12 col-md-6">
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Balance</q-item-label>
                          <q-item-label>{{ season.record }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>

                    <div class="col-12 col-md-6">
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Puntos</q-item-label>
                          <q-item-label>{{ season.points }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>

                  <q-item v-if="season.notes">
                    <q-item-section>
                      <q-item-label caption>Notas</q-item-label>
                      <q-item-label>{{ season.notes }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>

      <!-- Achievements -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="emoji_events" class="q-mr-sm" />
              <p class="q-my-auto">Logros</p>
            </div>

            <q-list v-if="history.achievements && history.achievements.length">
              <q-item v-for="(achievement, index) in history.achievements" :key="index">
                <q-item-section avatar>
                  <q-icon
                    :name="getAchievementIcon(achievement.type)"
                    :color="getAchievementColor(achievement.type)"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ achievement.title }}</q-item-label>
                  <q-item-label caption>{{ achievement.year }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center text-grey-6 q-pa-md">No hay logros registrados</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Notable Players -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="people" class="q-mr-sm" />
              <p class="q-my-auto">Jugadores Destacados</p>
            </div>

            <q-list v-if="history.notablePlayers && history.notablePlayers.length">
              <q-item v-for="(player, index) in history.notablePlayers" :key="index">
                <q-item-section avatar>
                  <q-avatar>
                    <img v-if="player.photoUrl" :src="player.photoUrl" :alt="player.name" />
                    <q-icon v-else name="person" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ player.name }}</q-item-label>
                  <q-item-label caption>{{ player.period }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-chip v-if="player.achievement" color="secondary" text-color="white" size="sm">
                    {{ player.achievement }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center text-grey-6 q-pa-md">
              No hay jugadores destacados registrados
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Historical Stats -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="leaderboard" class="q-mr-sm" />
              <p class="q-my-auto">Estadísticas Históricas</p>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <q-card flat class="bg-blue-1 text-center q-pa-md">
                  <div class="text-h4">{{ history.stats?.totalMatches || 0 }}</div>
                  <div class="text-caption">Partidos Totales</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-blue-1 text-center q-pa-md">
                  <div class="text-h4">{{ history.stats?.totalWins || 0 }}</div>
                  <div class="text-caption">Victorias Totales</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-blue-1 text-center q-pa-md">
                  <div class="text-h4">{{ history.stats?.totalGoals || 0 }}</div>
                  <div class="text-caption">Goles Totales</div>
                </q-card>
              </div>

              <div class="col-6 col-md-3">
                <q-card flat class="bg-blue-1 text-center q-pa-md">
                  <div class="text-h4">{{ history.stats?.totalTitles || 0 }}</div>
                  <div class="text-caption">Títulos</div>
                </q-card>
              </div>
            </div>
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

// Mock interface for team history
interface TeamHistory {
  seasons: Array<{
    year: string;
    name: string;
    league: string;
    finalPosition?: number;
    record: string;
    points: number;
    notes?: string;
  }>;
  achievements: Array<{
    title: string;
    year: string;
    type: 'championship' | 'promotion' | 'award' | 'other';
  }>;
  notablePlayers: Array<{
    name: string;
    period: string;
    photoUrl?: string;
    achievement?: string;
  }>;
  stats?: {
    totalMatches: number;
    totalWins: number;
    totalGoals: number;
    totalTitles: number;
  };
}

interface Props {
  team: Team;
}

defineProps<Props>();

const notifications = useQuasarNotifications();
const loading = ref(false);

// Mock history data - in a real implementation, this would come from an API
const history = ref<TeamHistory>({
  seasons: [],
  achievements: [],
  notablePlayers: [],
});

const hasHistory = computed(() => {
  return (
    history.value.seasons.length > 0 ||
    history.value.achievements.length > 0 ||
    history.value.notablePlayers.length > 0
  );
});

const getAchievementIcon = (type: string) => {
  switch (type) {
    case 'championship':
      return 'emoji_events';
    case 'promotion':
      return 'trending_up';
    case 'award':
      return 'star';
    default:
      return 'flag';
  }
};

const getAchievementColor = (type: string) => {
  switch (type) {
    case 'championship':
      return 'amber';
    case 'promotion':
      return 'green';
    case 'award':
      return 'blue';
    default:
      return 'grey';
  }
};

const loadHistory = async () => {
  loading.value = true;

  try {
    // In a real implementation, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data for demonstration
    history.value = {
      seasons: [
        {
          year: '2024-2025',
          name: 'Temporada 2024-2025',
          league: 'Kings League',
          finalPosition: 3,
          record: '15-5-8',
          points: 50,
          notes: 'Clasificación a playoffs',
        },
        {
          year: '2023-2024',
          name: 'Temporada 2023-2024',
          league: 'Kings League',
          finalPosition: 5,
          record: '12-8-8',
          points: 44,
          notes: 'Semifinalista de Copa',
        },
        {
          year: '2022-2023',
          name: 'Temporada 2022-2023',
          league: 'Kings League',
          finalPosition: 8,
          record: '10-6-12',
          points: 36,
        },
      ],
      achievements: [
        {
          title: 'Semifinalista Kings League',
          year: '2024',
          type: 'championship',
        },
        {
          title: 'Mejor Ataque de la Temporada',
          year: '2023',
          type: 'award',
        },
        {
          title: 'Copa del Rey - Cuartos de Final',
          year: '2023',
          type: 'other',
        },
      ],
      notablePlayers: [
        {
          name: 'Carlos Rodríguez',
          period: '2022-2025',
          achievement: 'Máximo Goleador',
        },
        {
          name: 'Miguel Ángel Torres',
          period: '2023-2025',
          achievement: 'Capitán',
        },
        {
          name: 'Javier López',
          period: '2022-2024',
          achievement: 'MVP 2023',
        },
      ],
      stats: {
        totalMatches: 84,
        totalWins: 37,
        totalGoals: 112,
        totalTitles: 1,
      },
    };
  } catch (error) {
    notifications.notifyError('Error al cargar el historial');
    console.error('Error loading history:', error);
  } finally {
    loading.value = false;
  }
};

const refreshHistory = async () => {
  await loadHistory();
};

onMounted(async () => {
  await loadHistory();
});
</script>

<style lang="scss" scoped>
.team-history-section {
  .q-card {
    height: 100%;
  }

  .q-timeline {
    padding-left: 0;

    &__entry {
      padding-left: 40px;
    }
  }
}
</style>
