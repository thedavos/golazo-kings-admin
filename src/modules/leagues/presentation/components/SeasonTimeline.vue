<template>
  <div class="season-timeline">
    <q-timeline color="secondary">
      <q-timeline-entry
        v-for="season in seasons"
        :key="season.id"
        :title="season.name"
        :subtitle="formatDateRange(season)"
        :icon="season.isActive ? 'radio_button_checked' : 'radio_button_unchecked'"
        :color="season.isActive ? 'positive' : 'grey'"
      >
        <div class="season-content">
          <div class="row items-center justify-between q-mb-sm">
            <div class="col-auto">
              <q-chip
                v-if="season.isActive"
                color="positive"
                text-color="white"
                label="Temporada Activa"
                size="sm"
              />
            </div>
            <div class="col-auto">
              <q-btn flat round size="sm" icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 150px">
                    <q-item clickable @click="$emit('view-season', season.id)">
                      <q-item-section avatar>
                        <q-icon name="visibility" />
                      </q-item-section>
                      <q-item-section>Ver detalles</q-item-section>
                    </q-item>

                    <q-item clickable @click="$emit('edit-season', season.id)">
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                      v-if="!season.isActive"
                      clickable
                      @click="$emit('activate-season', season.id)"
                    >
                      <q-item-section avatar>
                        <q-icon name="check_circle" color="positive" />
                      </q-item-section>
                      <q-item-section>Activar</q-item-section>
                    </q-item>

                    <q-item v-else clickable @click="$emit('deactivate-season', season.id)">
                      <q-item-section avatar>
                        <q-icon name="cancel" color="negative" />
                      </q-item-section>
                      <q-item-section>Desactivar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>

          <div class="season-stats row q-col-gutter-sm q-mb-md">
            <div class="col-6 col-md-3">
              <q-card flat bordered class="text-center">
                <q-card-section class="q-pa-xs">
                  <div class="text-subtitle1">Equipos</div>
                  <div class="text-h6">{{ getRandomStat(5, 20) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-md-3">
              <q-card flat bordered class="text-center">
                <q-card-section class="q-pa-xs">
                  <div class="text-subtitle1">Partidos</div>
                  <div class="text-h6">{{ getRandomStat(10, 50) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-md-3">
              <q-card flat bordered class="text-center">
                <q-card-section class="q-pa-xs">
                  <div class="text-subtitle1">Jugadores</div>
                  <div class="text-h6">{{ getRandomStat(50, 200) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-md-3">
              <q-card flat bordered class="text-center">
                <q-card-section class="q-pa-xs">
                  <div class="text-subtitle1">Goles</div>
                  <div class="text-h6">{{ getRandomStat(20, 100) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="season-actions">
            <q-btn
              flat
              color="primary"
              label="Ver detalles"
              icon="visibility"
              @click="$emit('view-season', season.id)"
            />
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
import type { Season } from 'src/modules/leagues/domain/entities/season.entity';

interface Props {
  seasons: Season[];
}

defineProps<Props>();

defineEmits<{
  (e: 'view-season', seasonId: number): void;
  (e: 'edit-season', seasonId: number): void;
  (e: 'activate-season', seasonId: number): void;
  (e: 'deactivate-season', seasonId: number): void;
}>();

const formatDateRange = (season: Season): string => {
  const startDate = season.startDate
    ? new Date(season.startDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Sin fecha de inicio';

  const endDate = season.endDate
    ? new Date(season.endDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Sin fecha de fin';

  return `${startDate} - ${endDate}`;
};

// This is just for demo purposes - in a real app, these would be actual stats
const getRandomStat = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
</script>

<style lang="scss" scoped>
.season-timeline {
  .season-content {
    padding: 8px 0;

    .season-stats {
      .q-card {
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-2px);
          background-color: rgba(0, 0, 0, 0.02);
        }
      }
    }
  }
}
</style>
