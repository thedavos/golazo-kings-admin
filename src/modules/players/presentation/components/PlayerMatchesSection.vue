<template>
  <div class="player-matches-section">
    <q-card flat bordered>
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="event" class="q-mr-sm" />
          <p class="q-my-auto">Partidos del Jugador</p>
        </div>

        <!-- Filtros -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-select v-model="season" :options="seasonOptions" label="Temporada" outlined dense />
          </div>

          <div class="col-md-4 col-sm-6 col-xs-12">
            <q-select
              v-model="competition"
              :options="competitionOptions"
              label="Competición"
              outlined
              dense
            />
          </div>
        </div>

        <!-- Tabla de partidos (ejemplo) -->
        <q-table
          :rows="matchesData"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 5 }"
        >
          <!-- Fecha columna -->
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              {{ formatDate(props.row.date) }}
            </q-td>
          </template>

          <!-- Resultado columna -->
          <template v-slot:body-cell-result="props">
            <q-td :props="props">
              <div class="text-weight-bold" :class="getResultClass(props.row.result)">
                {{ props.row.result }}
              </div>
            </q-td>
          </template>

          <!-- Estadísticas columna -->
          <template v-slot:body-cell-stats="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-chip v-if="props.row.goals > 0" size="sm" color="positive" text-color="white">
                  {{ props.row.goals }} <q-icon name="sports_soccer" size="xs" class="q-ml-xs" />
                </q-chip>
                <q-chip v-if="props.row.assists > 0" size="sm" color="info" text-color="white">
                  {{ props.row.assists }} <q-icon name="emoji_events" size="xs" class="q-ml-xs" />
                </q-chip>
                <q-chip
                  v-if="props.row.yellowCards > 0"
                  size="sm"
                  color="warning"
                  text-color="white"
                >
                  {{ props.row.yellowCards }} <q-icon name="square" size="xs" class="q-ml-xs" />
                </q-chip>
                <q-chip v-if="props.row.redCards > 0" size="sm" color="negative" text-color="white">
                  {{ props.row.redCards }} <q-icon name="square" size="xs" class="q-ml-xs" />
                </q-chip>
              </div>
            </q-td>
          </template>
        </q-table>

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
import { ref } from 'vue';
import type { QTableProps } from 'quasar';

interface Props {
  playerId: number;
}

defineProps<Props>();

// Estado
const loading = ref(false);
const season = ref('2023-2024');
const competition = ref('Todos');

// Opciones
const seasonOptions = ['2023-2024', '2022-2023', '2021-2022'];

const competitionOptions = ['Todos', 'Liga Regular', 'Playoffs', 'Copa'];

// Columnas de la tabla
const columns: QTableProps['columns'] = [
  { name: 'date', label: 'Fecha', field: 'date', align: 'left', sortable: true },
  {
    name: 'competition',
    label: 'Competición',
    field: 'competition',
    align: 'left',
    sortable: true,
  },
  { name: 'opponent', label: 'Rival', field: 'opponent', align: 'left', sortable: true },
  { name: 'result', label: 'Resultado', field: 'result', align: 'center', sortable: false },
  { name: 'minutes', label: 'Minutos', field: 'minutes', align: 'center', sortable: true },
  { name: 'stats', label: 'Estadísticas', field: 'stats', align: 'center', sortable: false },
];

// Datos de ejemplo
const matchesData = [
  {
    id: 1,
    date: new Date(2023, 9, 15),
    competition: 'Liga Regular',
    opponent: 'Kunisports',
    result: '3-1',
    minutes: 90,
    goals: 2,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 2,
    date: new Date(2023, 9, 22),
    competition: 'Liga Regular',
    opponent: 'El Barrio',
    result: '2-2',
    minutes: 85,
    goals: 0,
    assists: 1,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 3,
    date: new Date(2023, 9, 29),
    competition: 'Copa',
    opponent: 'Los Troncos FC',
    result: '0-1',
    minutes: 90,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 4,
    date: new Date(2023, 10, 5),
    competition: 'Liga Regular',
    opponent: 'Porcinos FC',
    result: '4-2',
    minutes: 90,
    goals: 1,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 5,
    date: new Date(2023, 10, 12),
    competition: 'Liga Regular',
    opponent: 'Saiyans FC',
    result: '1-3',
    minutes: 70,
    goals: 0,
    assists: 0,
    yellowCards: 1,
    redCards: 1,
  },
];

// Métodos
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getResultClass = (result: string): string => {
  const [goalsFor, goalsAgainst] = result.split('-').map(Number);

  if (!goalsFor || !goalsAgainst) {
    return 'text-warning';
  }

  if (goalsFor > goalsAgainst) {
    return 'text-positive';
  } else if (goalsFor < goalsAgainst) {
    return 'text-negative';
  } else {
    return 'text-warning';
  }
};
</script>

<style lang="scss" scoped>
.player-matches-section {
  .q-table {
    border-radius: 4px;
  }
}
</style>
