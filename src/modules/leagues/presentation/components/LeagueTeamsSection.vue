<template>
  <div class="league-teams-section">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center q-pa-lg">
      <q-spinner size="3rem" color="primary" />
      <p class="q-mt-md text-subtitle1">Cargando equipos...</p>
    </div>

    <!-- Error state -->
    <q-card v-else-if="error" class="error-card q-pa-md text-center">
      <q-icon name="error" size="3rem" color="negative" />
      <p class="text-subtitle1 q-mt-sm">Error al cargar los equipos</p>
      <p class="text-caption q-mb-md">{{ error }}</p>
      <q-btn color="primary" label="Reintentar" @click="refetch" />
    </q-card>

    <!-- Empty state -->
    <div v-else-if="!teams.length" class="empty-state text-center q-pa-xl">
      <q-icon name="sports_soccer" size="4rem" color="grey-4" />
      <h6 class="q-mt-md q-mb-sm">No hay equipos</h6>
      <p class="text-grey-6">Esta liga aún no tiene equipos asociados.</p>
      <q-btn color="primary" icon="add" label="Agregar Equipo" @click="$emit('add-team')" />
    </div>

    <!-- Teams list -->
    <template v-else>
      <div class="row q-mb-md justify-between items-center">
        <div class="col-auto">
          <div class="text-h6">{{ teams.length }} Equipos</div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" icon="add" label="Agregar Equipo" @click="$emit('add-team')" />
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="team in teams" :key="team.id" class="col-md-4 col-sm-6 col-xs-12">
          <q-card class="team-card">
            <q-card-section class="team-header row items-center no-wrap">
              <q-avatar size="56px" class="q-mr-md">
                <img v-if="team.logoUrl" :src="team.logoUrl" :alt="team.name" />
                <q-icon v-else name="sports_soccer" size="40px" color="grey-7" />
              </q-avatar>

              <div class="col ellipsis">
                <div class="text-h6">{{ team.name }}</div>
                <div class="flex items-center">
                  <q-icon name="place" size="xs" />
                  <p class="q-my-auto q-ml-xs">{{ team.fullLocation }}</p>
                </div>
              </div>

              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list padding bordered dense>
                    <q-item clickable @click="$emit('view-team', team.id)">
                      <q-item-section>Ver detalles</q-item-section>
                    </q-item>

                    <q-item clickable @click="$emit('edit-team', team.id)">
                      <q-item-section>Editar</q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item clickable @click="$emit('remove-team', team.id)">
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pl-none">
              <q-list dense>
                <q-item v-if="team.abbr">
                  <q-item-section>
                    <q-item-label caption>Abreviación</q-item-label>
                    <q-item-label>{{ team.abbr }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="team.foundationYear">
                  <q-item-section>
                    <q-item-label caption>Fundación</q-item-label>
                    <q-item-label>{{ team.foundationYear }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="team.venue">
                  <q-item-section>
                    <q-item-label caption>Estadio</q-item-label>
                    <q-item-label>{{ team.venue }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                color="primary"
                label="Ver detalles"
                @click="$emit('view-team', team.id)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useTeamListStore } from 'src/modules/teams/stores/teamList.store';
import { useTeamFiltersStore } from 'src/modules/teams/stores/teamFilters.store';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

interface Props {
  leagueId: number;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'add-team'): void;
  (e: 'view-team', teamId: number): void;
  (e: 'edit-team', teamId: number): void;
  (e: 'remove-team', teamId: number): void;
}>();

// Stores
const teamListStore = useTeamListStore();
const teamFiltersStore = useTeamFiltersStore();

// State
const isLoading = computed(() => teamListStore.isLoading);
const error = computed(() => teamListStore.error);
const refetch = () => teamListStore.refetch();

// Set filter for this league
onMounted(() => {
  teamFiltersStore.setLeagueFilter(props.leagueId);
});

onUnmounted(() => {
  teamFiltersStore.setLeagueFilter(null);
});

// Get teams filtered by league
const teams = computed<Team[]>(() => {
  return teamListStore.teams;
});
</script>
