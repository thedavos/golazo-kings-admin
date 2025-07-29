<template>
  <div class="player-stats-section">
    <q-card flat bordered>
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="assessment" class="q-mr-sm" />
          <p class="q-my-auto">Estadísticas del Jugador</p>
        </div>

        <div v-if="player.seasonStats && player.seasonStats.length > 0">
          <!-- Aquí irían las estadísticas reales del jugador -->
          <div class="row q-col-gutter-md">
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card class="stat-card text-center">
                <q-card-section>
                  <div class="text-h6">Partidos</div>
                  <div class="text-h3 q-mt-sm">{{ getRandomStat(50) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card class="stat-card text-center">
                <q-card-section>
                  <div class="text-h6">Goles</div>
                  <div class="text-h3 q-mt-sm">{{ getRandomStat(30) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card class="stat-card text-center">
                <q-card-section>
                  <div class="text-h6">Asistencias</div>
                  <div class="text-h3 q-mt-sm">{{ getRandomStat(20) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card class="stat-card text-center">
                <q-card-section>
                  <div class="text-h6">Valoración</div>
                  <div class="text-h3 q-mt-sm">{{ (Math.random() * 3 + 7).toFixed(1) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="q-mt-lg">
            <p class="text-italic text-grey-8 text-center">
              Nota: Esta es una visualización de ejemplo. Las estadísticas reales se implementarán
              en una versión futura.
            </p>
          </div>
        </div>

        <div v-else class="text-center q-pa-md">
          <q-icon name="info" size="2rem" color="grey-7" />
          <p class="text-grey-7 q-mt-sm">No hay estadísticas disponibles para este jugador</p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { Player } from 'src/modules/players/domain/entities/player.entity';

interface Props {
  player: Player;
}

defineProps<Props>();

// Función para generar estadísticas aleatorias (solo para demostración)
const getRandomStat = (max: number): number => {
  return Math.floor(Math.random() * max);
};
</script>

<style lang="scss" scoped>
.player-stats-section {
  .stat-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
