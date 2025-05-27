<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column full-height">
      <!-- Header -->
      <q-card-section class="row items-center q-pa-md text-white">
        <q-icon name="visibility" size="md" class="q-mr-md" />
        <div class="text-h6">Detalles de la Liga</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section v-if="viewLeague">
        <div class="text-h6 q-mb-md">
          {{ viewLeague.name }}
        </div>

        <div class="row q-gutter-md">
          <div class="col-md-6 col-xs-12">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Información básica</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Nombre completo</q-item-label>
                  <q-item-label caption>{{ viewLeague.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Abreviación</q-item-label>
                  <q-item-label caption>{{ viewLeague.abbr }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Ubicación</q-item-label>
                  <q-item-label caption>{{ viewLeague.location }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Número de equipos</q-item-label>
                  <q-item-label caption>{{ viewLeague.numberOfTeams }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Estado y configuración</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Estado</q-item-label>
                  <q-item-label caption>
                    <q-chip
                      :color="getStatusColor(viewLeague.status)"
                      text-color="white"
                      :label="viewLeague.status"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Liga activa</q-item-label>
                  <q-item-label caption>
                    <q-chip
                      :color="viewLeague.isActive ? 'positive' : 'negative'"
                      text-color="white"
                      :label="viewLeague.isActive ? 'Sí' : 'No'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Liga visible</q-item-label>
                  <q-item-label caption>
                    <q-chip
                      :color="viewLeague.isVisible ? 'info' : 'grey'"
                      text-color="white"
                      :label="viewLeague.isVisible ? 'Sí' : 'No'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Temporadas activas</q-item-label>
                  <q-item-label caption>
                    {{ viewLeague.hasActiveSeason() ? 'Sí' : 'No' }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <div class="q-mt-md">
          <q-item-label overline>Descripción</q-item-label>
          <p>{{ viewLeague.description }}</p>
        </div>

        <div class="q-mt-md" v-if="viewLeague.seasons.length > 0">
          <q-item-label overline>Temporadas ({{ viewLeague.seasons.length }})</q-item-label>
          <q-list bordered>
            <q-item v-for="season in viewLeague.seasons" :key="season.id">
              <q-item-section>
                <q-item-label>{{ season.name }}</q-item-label>
                <q-item-label caption>
                  {{ season.startDate ? season.startDate.toLocaleDateString() : 'Sin fecha' }} -
                  {{ season.endDate ? season.endDate.toLocaleDateString() : 'Sin fecha' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side v-if="season.isActive">
                <q-chip color="positive" text-color="white" label="Activa" size="sm" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <!--      <q-card-actions align="right">-->
      <!--        <q-btn flat label="Cerrar" @click="showDetailsDialog = false" />-->
      <!--        <q-btn color="warning" label="Editar" @click="editFromDetails" />-->
      <!--      </q-card-actions>-->
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getStatusColor } from 'src/modules/leagues/presentation/utils/getStatusColor.utils';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  modelValue: boolean;
  viewLeague: League;
}

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const close = () => {
  emit('close');
};
</script>
