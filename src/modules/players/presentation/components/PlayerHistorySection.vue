<template>
  <div class="player-history-section">
    <q-card flat bordered>
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="history" class="q-mr-sm" />
          <p class="q-my-auto">Historial del Jugador</p>
        </div>

        <div class="timeline-container">
          <!-- Timeline -->
          <q-timeline color="primary">
            <q-timeline-entry
              v-for="(entry, index) in historyEntries"
              :key="index"
              :title="entry.title"
              :subtitle="entry.date"
              :icon="entry.icon"
              :color="entry.color"
            >
              <div>
                {{ entry.description }}
              </div>

              <div v-if="entry.team" class="q-mt-sm">
                <q-chip color="primary" text-color="white">
                  {{ entry.team }}
                </q-chip>
              </div>
            </q-timeline-entry>
          </q-timeline>

          <div v-if="historyEntries.length === 0" class="text-center q-pa-md">
            <q-icon name="info" size="2rem" color="grey-7" />
            <p class="text-grey-7 q-mt-sm">
              No hay eventos históricos registrados para este jugador
            </p>
          </div>
        </div>

        <div class="q-mt-lg">
          <p class="text-italic text-grey-8 text-center">
            Nota: Esta es una visualización de ejemplo. Los datos reales se implementarán en una
            versión futura.
          </p>
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

const props = defineProps<Props>();

// Datos de ejemplo para la línea de tiempo
const historyEntries = [
  {
    title: 'Fichaje',
    date: '15/08/2022',
    icon: 'person_add',
    color: 'positive',
    description: 'Se unió al equipo como jugador del draft',
    team: props.player.team?.name || 'Equipo actual',
  },
  {
    title: 'Debut',
    date: '01/09/2022',
    icon: 'sports_soccer',
    color: 'primary',
    description: 'Primer partido oficial con el equipo',
    team: props.player.team?.name || 'Equipo actual',
  },
  {
    title: 'Primer Gol',
    date: '15/09/2022',
    icon: 'emoji_events',
    color: 'secondary',
    description: 'Anotó su primer gol en la victoria 3-1 contra Kunisports',
    team: props.player.team?.name || 'Equipo actual',
  },
  {
    title: 'Lesión',
    date: '10/11/2022',
    icon: 'healing',
    color: 'negative',
    description: 'Lesión muscular que lo mantuvo fuera durante 3 semanas',
    team: props.player.team?.name || 'Equipo actual',
  },
  {
    title: 'Renovación',
    date: '01/07/2023',
    icon: 'assignment',
    color: 'info',
    description: 'Renovó contrato por una temporada más',
    team: props.player.team?.name || 'Equipo actual',
  },
];
</script>

<style lang="scss" scoped>
.player-history-section {
  .timeline-container {
    padding: 1rem 0;
  }
}
</style>
