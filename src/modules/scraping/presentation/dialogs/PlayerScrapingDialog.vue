<template>
  <q-dialog
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Scraping de Jugadores</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-stepper v-model="step" vertical color="primary" animated :contracted="step === 3">
        <!-- Step 1: Select Team -->
        <q-step :name="1" title="Seleccionar Equipo" icon="sports_soccer" :done="step > 1">
          <p class="text-body1">Selecciona el equipo del que deseas scrapear jugadores</p>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                emit-value
                map-options
                dense
                outlined
                option-label="name"
                label="Equipo"
                v-model="selectedTeam"
                :options="teams"
                :rules="[(val) => !!val || 'Debes seleccionar un equipo']"
              />
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn color="primary" label="Continuar" @click="step = 2" :disabled="!selectedTeam" />
            <q-btn flat color="primary" label="Cancelar" v-close-popup />
          </q-stepper-navigation>
        </q-step>

        <!-- Step 2: Configure Scraping -->
        <q-step :name="2" title="Configurar Scraping" icon="settings" :done="step > 2">
          <p class="text-body1">
            Configura las opciones de scraping para <strong>{{ selectedTeam?.name }}</strong>
          </p>

          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">Opciones de Scraping</div>

            <div class="q-gutter-y-md">
              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox v-model="scrapingOptions.createMissing" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Crear jugadores nuevos</q-item-label>
                  <q-item-label caption>
                    Crear jugadores que no existen en la base de datos
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple v-if="scrapingOptions.createMissing">
                <q-item-section avatar>
                  <q-checkbox v-model="scrapingOptions.activateNew" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Activar nuevos jugadores</q-item-label>
                  <q-item-label caption>
                    Los nuevos jugadores se crearán como activos
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox v-model="scrapingOptions.updateExisting" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Actualizar jugadores existentes</q-item-label>
                  <q-item-label caption>
                    Actualizar datos de jugadores que ya existen
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section avatar>
                  <q-checkbox v-model="scrapingOptions.preserveManualData" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Preservar datos manuales</q-item-label>
                  <q-item-label caption>
                    Los datos ingresados manualmente no serán sobrescritos por el scraping
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="text-h6 q-mb-md q-mt-lg">Filtros de Scraping</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="scrapingOptions.nameFilter"
                  label="Filtrar por nombre"
                  clearable
                  dense
                  outlined
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="scrapingOptions.positionFilter"
                  :options="positionOptions"
                  label="Filtrar por posición"
                  clearable
                  emit-value
                  map-options
                  dense
                  outlined
                />
              </div>

              <div class="col-12 col-md-6">
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="scrapingOptions.includeInactive" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Incluir jugadores inactivos</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12 col-md-6">
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-checkbox v-model="scrapingOptions.isQueensLeague" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Queens League</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Iniciar Scraping"
              :loading="loading"
              @click="startScraping"
            />
            <q-btn flat color="primary" label="Atrás" @click="step = 1" />
          </q-stepper-navigation>
        </q-step>

        <!-- Step 3: Results -->
        <q-step :name="3" title="Resultados" icon="done">
          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">Resultados del Scraping</div>

            <q-card bordered class="q-mb-md">
              <q-card-section>
                <div class="row items-center q-gutter-md">
                  <q-icon name="check_circle" color="positive" size="md" />
                  <div>
                    <div class="text-h6">Scraping completado</div>
                    <div class="text-subtitle2">Equipo: {{ selectedTeam?.name }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-4">
                    <q-card flat bordered>
                      <q-card-section class="bg-positive text-white">
                        <div class="text-h6">Jugadores Creados</div>
                      </q-card-section>
                      <q-card-section class="text-center">
                        <div class="text-h4">{{ scrapingResult.itemsCreated || 0 }}</div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-4">
                    <q-card flat bordered>
                      <q-card-section class="bg-warning text-white">
                        <div class="text-h6">Jugadores Actualizados</div>
                      </q-card-section>
                      <q-card-section class="text-center">
                        <div class="text-h4">{{ scrapingResult.itemsUpdated || 0 }}</div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-4">
                    <q-card flat bordered>
                      <q-card-section class="bg-info text-white">
                        <div class="text-h6">Jugadores Procesados</div>
                      </q-card-section>
                      <q-card-section class="text-center">
                        <div class="text-h4">{{ scrapingResult.itemsScraped || 0 }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <q-stepper-navigation>
            <q-btn color="primary" label="Finalizar" v-close-popup />
            <q-btn flat color="primary" label="Nuevo Scraping" @click="resetScraping" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useScrapingPlayers } from 'src/modules/scraping/presentation/composables/useScrapingPlayers.composable';
import { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { PlayerScrapingResult } from 'src/modules/scraping/dtos/scrapingResult.dto';
import type { ScrapingOptions } from 'src/modules/scraping/presentation/composables/useScraping.composable';

// Props
interface Props {
  modelValue: boolean;
  teams: Team[];
}

defineProps<Props>();

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'scraping-completed', result: any): void;
}

const emit = defineEmits<Emits>();

// Composables
const { scrapePlayersByTeam } = useScrapingPlayers();

// Reactive data
const step = ref(1);
const selectedTeam = ref<Team | null>(null);
const loading = ref(false);
const scrapingResult = reactive<PlayerScrapingResult>({
  type: ScrapingType.PLAYERS,
  itemsScraped: 0,
  itemsUpdated: 0,
  itemsCreated: 0,
  success: false,
  scrapedItems: [],
  details: {},
  duration: 0,
  errors: [],
  timestamp: new Date(),
});

// Scraping options
const scrapingOptions = ref<ScrapingOptions>({
  createMissing: true,
  activateNew: true,
  updateExisting: true,
  preserveManualData: true,
  nameFilter: '',
  positionFilter: '',
  isQueensLeague: false,
  includeInactive: false,
});

// Position options
const positionOptions = [
  { label: 'Portero', value: 'GK' },
  { label: 'Defensa', value: 'DEF' },
  { label: 'Centrocampista', value: 'MID' },
  { label: 'Delantero', value: 'FWD' },
];

// Methods
const startScraping = async () => {
  if (!selectedTeam.value) return;

  loading.value = true;

  try {
    const result = await scrapePlayersByTeam(selectedTeam.value, scrapingOptions.value);

    scrapingResult.itemsScraped = result.itemsScraped;
    scrapingResult.itemsUpdated = result.itemsUpdated;
    scrapingResult.itemsCreated = result.itemsCreated;
    scrapingResult.success = result.success;
    scrapingResult.scrapedItems = result.scrapedItems;
    scrapingResult.details = result.details!;
    scrapingResult.duration = result.duration;
    scrapingResult.errors = result.errors;

    emit('scraping-completed', result);
    step.value = 3;
  } catch (error) {
    console.error('Error during player scraping:', error);
  } finally {
    loading.value = false;
  }
};

const resetScraping = () => {
  step.value = 1;
  selectedTeam.value = null;
  scrapingOptions.value = {
    createMissing: true,
    activateNew: true,
    updateExisting: true,
    preserveManualData: true,
    nameFilter: '',
    positionFilter: '',
    includeInactive: false,
  };

  scrapingResult.itemsScraped = 0;
  scrapingResult.itemsUpdated = 0;
  scrapingResult.itemsCreated = 0;
  scrapingResult.success = false;
  scrapingResult.scrapedItems = [];
  scrapingResult.details = {};
  scrapingResult.duration = 0;
  scrapingResult.errors = [];
  scrapingResult.timestamp = new Date();
};
</script>
