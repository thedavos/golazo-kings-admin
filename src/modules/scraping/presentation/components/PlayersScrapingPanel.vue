<template>
  <div>
    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-select
              v-model="selectedTeam"
              :options="[]"
              option-label="name"
              option-value="id"
              label="Filtrar por Equipo"
              clearable
              emit-value
              map-options
              @update:model-value="onTeamFilter"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="searchText"
              label="Buscar jugadores"
              debounce="300"
              clearable
              @update:model-value="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="positionFilter"
              :options="positionOptions"
              label="Posición"
              clearable
              @update:model-value="onPositionFilter"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              label="Estado"
              clearable
              @update:model-value="onStatusFilter"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              color="secondary"
              icon="refresh"
              label="Actualizar"
              @click="$emit('refresh')"
              :loading="false"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Players Table -->
    <!--    <q-card>-->
    <!--      <q-card-section>-->
    <!--        <div class="text-h6 q-mb-md">Jugadores</div>-->
    <!--        <q-table-->
    <!--          :rows="players"-->
    <!--          :columns="columns"-->
    <!--          :loading="loading"-->
    <!--          :pagination="pagination"-->
    <!--          @request="onRequest"-->
    <!--          row-key="id"-->
    <!--          binary-state-sort-->
    <!--        >-->
    <!--          <template v-slot:body-cell-avatar="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-avatar v-if="props.row.avatarUrl" size="40px">-->
    <!--                <img :src="props.row.avatarUrl" :alt="props.row.name">-->
    <!--              </q-avatar>-->
    <!--              <q-icon v-else name="person" size="40px" color="grey-5" />-->
    <!--            </q-td>-->
    <!--          </template>-->

    <!--          <template v-slot:body-cell-team="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-chip-->
    <!--                :color="getTeamColor(props.row.teamId)"-->
    <!--                text-color="white"-->
    <!--                size="sm"-->
    <!--              >-->
    <!--                {{ getTeamName(props.row.teamId) }}-->
    <!--              </q-chip>-->
    <!--            </q-td>-->
    <!--          </template>-->

    <!--          <template v-slot:body-cell-position="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-chip-->
    <!--                :color="getPositionColor(props.row.position)"-->
    <!--                text-color="white"-->
    <!--                size="sm"-->
    <!--              >-->
    <!--                {{ props.row.position }}-->
    <!--              </q-chip>-->
    <!--            </q-td>-->
    <!--          </template>-->

    <!--          <template v-slot:body-cell-status="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-chip-->
    <!--                :color="props.row.isActive ? 'positive' : 'negative'"-->
    <!--                text-color="white"-->
    <!--                size="sm"-->
    <!--              >-->
    <!--                {{ props.row.isActive ? 'Activo' : 'Inactivo' }}-->
    <!--              </q-chip>-->
    <!--            </q-td>-->
    <!--          </template>-->

    <!--          <template v-slot:body-cell-scraped="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-icon-->
    <!--                v-if="props.row.originalScrapedData"-->
    <!--                name="cloud_download"-->
    <!--                color="info"-->
    <!--                size="sm"-->
    <!--              >-->
    <!--                <q-tooltip>-->
    <!--                  Scrapeado desde {{ props.row.originalScrapedData.source }}-->
    <!--                </q-tooltip>-->
    <!--              </q-icon>-->
    <!--              <q-icon v-else name="edit" color="grey-5" size="sm">-->
    <!--                <q-tooltip>Creado manualmente</q-tooltip>-->
    <!--              </q-icon>-->
    <!--            </q-td>-->
    <!--          </template>-->

    <!--          <template v-slot:body-cell-actions="props">-->
    <!--            <q-td :props="props">-->
    <!--              <q-btn-->
    <!--                flat-->
    <!--                round-->
    <!--                color="primary"-->
    <!--                icon="visibility"-->
    <!--                size="sm"-->
    <!--                @click="$emit('view-player', props.row)"-->
    <!--              >-->
    <!--                <q-tooltip>Ver detalles</q-tooltip>-->
    <!--              </q-btn>-->
    <!--              <q-btn-->
    <!--                flat-->
    <!--                round-->
    <!--                color="warning"-->
    <!--                icon="edit"-->
    <!--                size="sm"-->
    <!--                @click="$emit('edit-player', props.row)"-->
    <!--              >-->
    <!--                <q-tooltip>Editar</q-tooltip>-->
    <!--              </q-btn>-->
    <!--              <q-btn-->
    <!--                flat-->
    <!--                round-->
    <!--                color="negative"-->
    <!--                icon="delete"-->
    <!--                size="sm"-->
    <!--                @click="$emit('delete-player', props.row)"-->
    <!--              >-->
    <!--                <q-tooltip>Eliminar</q-tooltip>-->
    <!--              </q-btn>-->
    <!--            </q-td>-->
    <!--          </template>-->
    <!--        </q-table>-->
    <!--      </q-card-section>-->
    <!--    </q-card>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
// interface Props {
//   players: Player[];
//   teams: Team[];
//   loading: boolean;
// }

// const props = defineProps<Props>();

// Emits
// interface Emits {
//   (e: 'refresh'): void;
//   (e: 'view-player', player: Player): void;
//   (e: 'edit-player', player: Player): void;
//   (e: 'delete-player', player: Player): void;
// }
//
// const emit = defineEmits<Emits>();

// Reactive data
const selectedTeam = ref<number | null>(null);
const searchText = ref('');
const positionFilter = ref<string | null>(null);
const statusFilter = ref<string | null>(null);

// Pagination
// const pagination = ref({
//   sortBy: 'name',
//   descending: false,
//   page: 1,
//   rowsPerPage: 10,
//   rowsNumber: 0,
// });

// Computed
// const teamOptions = computed(() => [
//   { id: null, name: 'Todos los equipos' },
//   ...props.teams.map(team => ({
//     id: team.id,
//     name: team.name
//   }))
// ]);

const positionOptions = [
  { label: 'Todas', value: null },
  { label: 'Portero', value: 'GK' },
  { label: 'Defensa', value: 'DEF' },
  { label: 'Centrocampista', value: 'MID' },
  { label: 'Delantero', value: 'FWD' },
];

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' },
  { label: 'Scrapeados', value: 'scraped' },
  { label: 'Manuales', value: 'manual' },
];

// Table columns
// const columns = [
//   {
//     name: 'avatar',
//     label: 'Avatar',
//     field: 'avatarUrl',
//     align: 'center',
//     sortable: false,
//   },
//   {
//     name: 'name',
//     label: 'Nombre',
//     field: 'name',
//     align: 'left',
//     sortable: true,
//   },
//   {
//     name: 'jerseyNumber',
//     label: 'Dorsal',
//     field: 'jerseyNumber',
//     align: 'center',
//     sortable: true,
//   },
//   {
//     name: 'position',
//     label: 'Posición',
//     field: 'position',
//     align: 'center',
//     sortable: true,
//   },
//   {
//     name: 'team',
//     label: 'Equipo',
//     field: 'teamId',
//     align: 'center',
//     sortable: true,
//   },
//   {
//     name: 'age',
//     label: 'Edad',
//     field: 'birthDate',
//     align: 'center',
//     sortable: true,
//     format: (val: string) => {
//       if (!val) return 'N/A';
//       const age = new Date().getFullYear() - new Date(val).getFullYear();
//       return `${age} años`;
//     },
//   },
//   {
//     name: 'status',
//     label: 'Estado',
//     field: 'isActive',
//     align: 'center',
//     sortable: true,
//   },
//   {
//     name: 'scraped',
//     label: 'Origen',
//     field: 'originalScrapedData',
//     align: 'center',
//     sortable: false,
//   },
//   {
//     name: 'actions',
//     label: 'Acciones',
//     field: 'actions',
//     align: 'center',
//     sortable: false,
//   },
// ];

// Methods
const onTeamFilter = () => {
  // Implementar filtrado por equipo
};

const onSearch = () => {
  // Implementar búsqueda
};

const onPositionFilter = () => {
  // Implementar filtrado por posición
};

const onStatusFilter = () => {
  // Implementar filtrado por estado
};

// const onRequest = () => {
// Implementar paginación
// };

// const getTeamName = (teamId: number): string => {
//   const team = props.teams.find(t => t.id === teamId);
//   return team?.name || 'Equipo desconocido';
// };

// const getTeamColor = (teamId: number): string => {
//   const colors = ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning'];
//   return colors[teamId % colors.length];
// };

// const getPositionColor = (position: string): string => {
//   const positionColors: Record<string, string> = {
//     'GK': 'orange',
//     'DEF': 'blue',
//     'MID': 'green',
//     'FWD': 'red'
//   };
//   return positionColors[position] || 'grey';
// };
</script>
