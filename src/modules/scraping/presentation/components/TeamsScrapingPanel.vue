<template>
  <div>
    <!-- Filters -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-select
              v-model="selectedLeague"
              option-label="name"
              option-value="id"
              label="Filtrar por Liga"
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="searchText" label="Buscar equipos" debounce="300" clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-select v-model="statusFilter" :options="statusOptions" label="Estado" clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              color="secondary"
              icon="refresh"
              label="Actualizar"
              @click="$emit('refresh')"
              :loading="loading"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { League } from 'src/modules/leagues/domain/entities/league.entity';

// Props
interface Props {
  // teams: Team[];
  leagues: League[];
  loading: boolean;
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: 'refresh'): void;
  // (e: 'view-team', team: Team): void;
  // (e: 'edit-team', team: Team): void;
  // (e: 'delete-team', team: Team): void;
  // (e: 'scrape-team-players', team: Team): void;
}

const emit = defineEmits<Emits>();

// Reactive data
const selectedLeague = ref<number | null>(null);
const searchText = ref('');
const statusFilter = ref<string | null>(null);

// Computed
const leagueOptions = computed(() => [
  { id: null, name: 'Todas las ligas' },
  ...props.leagues.map((league) => ({
    id: league.id,
    name: league.name,
  })),
]);

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' },
  { label: 'Scrapeados', value: 'scraped' },
  { label: 'Manuales', value: 'manual' },
];
</script>
