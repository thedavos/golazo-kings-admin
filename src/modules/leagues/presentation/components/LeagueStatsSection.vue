<template>
  <div class="league-stats-section">
    <!-- Key Performance Indicators -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <league-stats-card
          icon="sports_soccer"
          :value="league.numberOfTeams"
          label="Equipos"
          color="primary"
          size="lg"
        />
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <league-stats-card
          icon="event"
          :value="league.seasons.length"
          label="Temporadas"
          color="secondary"
          size="lg"
        />
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <league-stats-card
          icon="check_circle"
          :value="activeSeasonCount"
          label="Temporadas Activas"
          color="positive"
          size="lg"
        />
      </div>

      <div class="col-md-3 col-sm-6 col-xs-12">
        <league-stats-card
          icon="calendar_today"
          :value="league.getAge() || 'N/A'"
          label="Años de Antigüedad"
          :sub-label="
            league.foundationYear
              ? `Fundada en ${league.foundationYear}`
              : 'Año de fundación no disponible'
          "
          color="deep-orange"
          size="lg"
        />
      </div>
    </div>

    <!-- League Status -->
    <q-card flat class="q-mb-md">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Estado de la Liga</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <league-stats-card
              :icon="league.isActive ? 'toggle_on' : 'toggle_off'"
              :value="league.isActive ? 'Activa' : 'Inactiva'"
              label="Estado de Activación"
              :color="league.isActive ? 'positive' : 'negative'"
            />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <league-stats-card
              :icon="league.isVisible ? 'visibility' : 'visibility_off'"
              :value="league.isVisible ? 'Visible' : 'Oculta'"
              label="Visibilidad"
              :color="league.isVisible ? 'info' : 'grey'"
            />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <league-stats-card
              :icon="league.isOperational ? 'check_circle' : 'cancel'"
              :value="league.isOperational ? 'Operativa' : 'No Operativa'"
              label="Estado Operacional"
              :color="league.isOperational ? 'positive' : 'negative'"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- League Activity -->
    <q-card flat class="q-mb-md">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Actividad de la Liga</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-xs-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1">Última Actualización</div>
                <div class="row items-center q-mt-sm">
                  <div class="text-h6">{{ formatDateToLongString(league.updatedAt) }}</div>
                </div>
                <div class="text-caption text-grey-7">
                  {{ formatRelativeTime(league.updatedAt) }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1">Fecha de Creación</div>
                <div class="row items-center q-mt-sm">
                  <div class="text-h6">{{ formatDateToLongString(league.createdAt) }}</div>
                </div>
                <div class="text-caption text-grey-7">
                  {{ formatRelativeTime(league.createdAt) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- League Health -->
    <q-card flat>
      <q-card-section class="q-pb-none">
        <div class="text-h6">Salud de la Liga</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-xs-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1">Temporadas Activas vs. Total</div>
                <div class="q-mt-md">
                  <q-linear-progress
                    rounded
                    size="25px"
                    track-color="grey-3"
                    :value="seasonProgressValue"
                    :color="seasonProgressColor"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${activeSeasonCount} / ${league.seasons.length}`"
                      />
                    </div>
                  </q-linear-progress>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    {{ seasonProgressText }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1">Completitud de la Información</div>
                <div class="q-mt-md">
                  <q-linear-progress
                    rounded
                    size="25px"
                    track-color="grey-3"
                    :value="completenessValue"
                    :color="completenessColor"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="black"
                        :label="`${Math.round(completenessValue * 100)}%`"
                      />
                    </div>
                  </q-linear-progress>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    {{ completenessText }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LeagueStatsCard from './LeagueStatsCard.vue';
import { formatRelativeTime, formatDateToLongString } from 'src/modules/shared/utils/date.util';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  league: League;
}

const props = defineProps<Props>();

// Active season count
const activeSeasonCount = computed(() => {
  return props.league.seasons.filter((season) => season.isActive).length;
});

// Season progress
const seasonProgressValue = computed(() => {
  if (props.league.seasons.length === 0) return 0;
  return activeSeasonCount.value / props.league.seasons.length;
});

const seasonProgressColor = computed(() => {
  const value = seasonProgressValue.value;
  if (value === 0) return 'negative';
  if (value < 0.5) return 'warning';
  return 'positive';
});

const seasonProgressText = computed(() => {
  const value = seasonProgressValue.value;
  if (value === 0) return 'No hay temporadas activas';
  if (value < 0.5) return 'Pocas temporadas activas';
  if (value < 1) return 'Buena proporción de temporadas activas';
  return 'Todas las temporadas están activas';
});

// Completeness of information
const completenessValue = computed(() => {
  let totalFields = 0;
  let filledFields = 0;

  // Check required fields
  totalFields += 5; // name, abbr, country, city, status
  filledFields += 5; // These are always filled

  // Check optional fields
  const optionalFields = [
    'logoUrl',
    'foundationYear',
    'website',
    'twitterHandle',
    'instagramHandle',
    'description',
    'rules',
  ];

  totalFields += optionalFields.length;

  for (const field of optionalFields) {
    if (props.league[field as keyof League]) {
      filledFields++;
    }
  }

  return filledFields / totalFields;
});

const completenessColor = computed(() => {
  const value = completenessValue.value;
  if (value < 0.5) return 'negative';
  if (value < 0.8) return 'warning';
  return 'positive';
});

const completenessText = computed(() => {
  const value = completenessValue.value;
  if (value < 0.5) return 'Información incompleta';
  if (value < 0.8) return 'Información parcialmente completa';
  if (value < 1) return 'Información casi completa';
  return 'Información completa';
});
</script>

<style lang="scss" scoped>
.league-stats-section {
  .q-card {
    border-radius: 8px;
  }
}
</style>
