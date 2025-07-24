<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none q-mb-md">
        <div class="text-h6">Scraping de Equipos</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section class="col q-pt-none">
        <q-stepper
          v-model="currentStep"
          ref="stepper"
          color="primary"
          animated
          header-nav
          class="full-height"
        >
          <!-- Step 1: Select League -->
          <q-step
            :name="1"
            title="Seleccionar Liga"
            icon="sports"
            :done="currentStep > 1"
            :header-nav="currentStep > 1"
          >
            <div class="q-gutter-md">
              <div class="text-subtitle1 q-mb-md">
                Selecciona la liga de la cual quieres scrapear los equipos:
              </div>

              <!-- Search Leagues -->
              <q-input
                v-model="leagueSearch"
                label="Buscar liga"
                debounce="300"
                rounded
                outlined
                dense
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-list
                bordered
                separator
                class="rounded-borders overflow-auto"
                style="max-height: 500px"
              >
                <q-item
                  v-for="league in filteredLeagues"
                  :key="league.id"
                  clickable
                  v-ripple
                  :active="selectedLeague?.id === league.id"
                  @click="selectLeague(league)"
                >
                  <q-item-section avatar>
                    <q-avatar v-if="league.logoUrl">
                      <img :src="league.logoUrl" :alt="league.name" />
                    </q-avatar>
                    <q-icon v-else name="apps" color="primary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ league.name }}</q-item-label>
                    <q-item-label caption> {{ league.country }} • {{ league.slug }} </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="column items-end">
                      <q-chip
                        :color="league.isActive ? 'positive' : 'negative'"
                        text-color="white"
                        size="sm"
                      >
                        {{ league.isActive ? 'Activa' : 'Inactiva' }}
                      </q-chip>
                      <div class="text-caption text-grey-6 q-mt-xs">0 equipos</div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <q-stepper-navigation>
              <q-btn
                color="primary"
                label="Siguiente"
                :disable="!selectedLeague"
                @click="nextStep"
              />
            </q-stepper-navigation>
          </q-step>

          <!-- Step 2: Configure Scraping -->
          <q-step
            :name="2"
            title="Configurar Scraping"
            icon="settings"
            :done="currentStep > 2"
            :header-nav="currentStep > 2"
          >
            <div class="row q-gutter-md">
              <div class="col-12 text-subtitle1 q-mb-sm">
                Configura las opciones de scraping para <strong>{{ selectedLeague?.name }}</strong
                >:
              </div>
              <!-- Preview -->
              <q-card class="col-3" flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Vista Previa</div>
                  <div class="text-body2 text-grey-7">
                    <div>
                      Liga seleccionada: <strong>{{ selectedLeague?.name }}</strong>
                    </div>
                    <div>
                      País: <strong>{{ selectedLeague?.country }}</strong>
                    </div>
                    <div>Equipos actuales en BD: <strong>0</strong></div>
                    <div class="q-mt-sm">
                      <q-chip
                        v-if="scrapingOptions.createMissing"
                        color="positive"
                        text-color="white"
                        size="sm"
                        class="q-mr-xs"
                      >
                        Crear nuevos
                      </q-chip>
                      <q-chip
                        v-if="scrapingOptions.updateExisting"
                        color="warning"
                        text-color="white"
                        size="sm"
                        class="q-mr-xs"
                      >
                        Actualizar existentes
                      </q-chip>
                      <q-chip
                        v-if="scrapingOptions.preserveManualData"
                        color="info"
                        text-color="white"
                        size="sm"
                        class="q-mr-xs"
                      >
                        Preservar manuales
                      </q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card class="col-4" flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Opciones de Procesamiento</div>

                  <q-checkbox
                    v-model="scrapingOptions.createMissing"
                    label="Crear equipos que no existen"
                    color="primary"
                  />

                  <div class="text-caption text-grey-7 q-ml-sm q-mb-md">
                    Los equipos scrapeados que no existan en la base de datos serán creados
                    automáticamente
                  </div>

                  <q-checkbox
                    v-model="scrapingOptions.updateExisting"
                    label="Actualizar equipos existentes"
                    color="primary"
                  />
                  <div class="text-caption text-grey-7 q-ml-sm q-mb-md">
                    Los equipos que ya existen serán actualizados con los nuevos datos scrapeados
                  </div>

                  <q-checkbox
                    v-model="scrapingOptions.preserveManualData"
                    label="Preservar datos manuales"
                    color="primary"
                  />
                  <div class="text-caption text-grey-7 q-ml-sm q-mb-md">
                    Los datos ingresados manualmente no serán sobrescritos por el scraping
                  </div>
                </q-card-section>
              </q-card>

              <q-card class="col-4" flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Filtros de Scraping</div>

                  <div class="row q-ma-sm-sm">
                    <div class="col-12 q-mb-md">
                      <q-input
                        v-model="scrapingOptions.nameFilter"
                        label="Filtrar por nombre (opcional)"
                        hint="Solo scrapear equipos que contengan este texto en el nombre"
                        clearable
                        dense
                        outlined
                      />
                    </div>

                    <div class="col-12">
                      <q-toggle
                        v-model="scrapingOptions.includeInactive"
                        label="Incluir equipos inactivos"
                        color="primary"
                      />
                    </div>

                    <div class="col-12 q-mt-sm">
                      <q-toggle
                        v-model="scrapingOptions.isQueensLeague"
                        label="Son equipos de Queens League"
                        color="primary"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <q-stepper-navigation class="q-mt-lg">
              <q-btn flat color="primary" label="Anterior" @click="previousStep" />
              <q-btn
                color="primary"
                label="Iniciar Scraping"
                class="q-ml-sm"
                @click="startScraping"
              />
            </q-stepper-navigation>
          </q-step>

          <!-- Step 3: Scraping Progress -->
          <q-step
            :name="3"
            title="Scraping en Progreso"
            icon="cloud_download"
            :done="scrapingCompleted"
          >
            <div class="q-gutter-md">
              <div class="text-center q-mb-sm">
                <q-spinner-dots v-if="!scrapingCompleted" color="primary" size="50px" />
                <q-icon
                  v-else
                  :name="scrapingResult?.success ? 'check_circle' : 'error'"
                  :color="scrapingResult?.success ? 'positive' : 'negative'"
                  size="50px"
                />
              </div>

              <div class="text-center text-h6 q-mb-sm">
                {{ scrapingStatus }}
              </div>

              <!-- Progress -->
              <q-linear-progress
                v-if="!scrapingCompleted"
                indeterminate
                color="primary"
                class="q-mt-lg"
              />

              <!-- Results -->
              <div v-if="scrapingResult" class="q-mt-lg">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row q-gutter-sm justify-start items-center">
                      <div class="text-subtitle1 col-12 col-md-auto">Equipos extraídos</div>
                      <q-badge rounded color="info" text-color="white" align="middle">
                        {{ scrapingResult.itemsScraped }} Extraídos
                      </q-badge>

                      <q-badge rounded color="positive" text-color="white" align="middle">
                        {{ scrapingResult.itemsCreated }} Creados
                      </q-badge>

                      <q-badge rounded color="warning" text-color="white" align="middle">
                        {{ scrapingResult.itemsUpdated }} Actualizados
                      </q-badge>

                      <q-badge rounded color="negative" text-color="white" align="middle">
                        {{ scrapingResult.errors.length }} Errores
                      </q-badge>
                    </div>

                    <!-- Scraped Teams List -->
                    <div
                      v-if="scrapingResult.scrapedItems && scrapingResult.scrapedItems.length > 0"
                      class="q-mt-lg"
                    >
                      <q-list bordered separator style="max-height: 300px; overflow-y: auto">
                        <q-item
                          v-for="team in scrapingResult.scrapedItems"
                          :key="team.id || team.slug"
                        >
                          <q-item-section avatar>
                            <q-avatar v-if="team.logoUrl">
                              <img :src="team.logoUrl" :alt="team.name" />
                            </q-avatar>
                            <q-icon v-else name="sports_soccer" />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label>{{ team.name }}</q-item-label>
                            <q-item-label caption>{{ team.slug }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-chip color="info" text-color="white" size="sm">
                              {{ team.isRecent && team.isRecent() ? 'Nuevo' : 'Actualizado' }}
                            </q-chip>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <!-- Errors -->
                    <div v-if="scrapingResult.errors.length > 0" class="q-mt-lg">
                      <q-expansion-item
                        label="Ver errores"
                        icon="error"
                        header-class="text-negative"
                      >
                        <q-list>
                          <q-item v-for="(error, index) in scrapingResult.errors" :key="index">
                            <q-item-section>
                              <q-item-label class="text-negative">{{ error }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-expansion-item>
                    </div>

                    <!-- Duration -->
                    <div class="q-mt-md text-center">
                      <q-chip color="grey-6" text-color="white" size="sm">
                        Duración: {{ formatDuration(scrapingResult.duration) }}
                      </q-chip>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-stepper-navigation class="q-mt-lg">
              <q-btn
                v-if="scrapingCompleted"
                color="primary"
                label="Finalizar"
                @click="finishScraping"
              />
              <q-btn
                v-if="scrapingCompleted && scrapingResult?.success"
                color="positive"
                label="Nuevo Scraping"
                @click="resetScraping"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useScraping } from 'src/modules/scraping/presentation/composables/useScraping.composable';
import type { ScrapingOptions } from 'src/modules/scraping/presentation/composables/useScraping.composable';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

// Props
interface Props {
  modelValue: boolean;
  leagues: League[];
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'scraping-completed', result: any): void;
}

const emit = defineEmits<Emits>();

const scrapingViewModel = useScraping();

// Reactive data
const currentStep = ref(1);
const selectedLeague = ref<League | null>(null);
const leagueSearch = ref('');
const scrapingCompleted = ref(false);
const scrapingStatus = ref('');

const scrapingOptions = ref<ScrapingOptions>({
  createMissing: true,
  updateExisting: true,
  preserveManualData: true,
  includeInactive: false,
  nameFilter: '',
  isQueensLeague: false,
});

// Computed
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const filteredLeagues = computed(() => {
  if (!leagueSearch.value) return props.leagues;

  const search = leagueSearch.value.toLowerCase();
  return props.leagues.filter(
    (league) =>
      league.name.toLowerCase().includes(search) ||
      league.country.toLowerCase().includes(search) ||
      league.slug.toLowerCase().includes(search),
  );
});

const scrapingResult = computed(() => scrapingViewModel.lastScrapingResult.value);

// Methods
const selectLeague = (league: League) => {
  selectedLeague.value = league;
};

const nextStep = () => {
  currentStep.value++;
};

const previousStep = () => {
  currentStep.value--;
};

const startScraping = async () => {
  if (!selectedLeague.value) return;

  currentStep.value = 3;
  scrapingCompleted.value = false;
  scrapingStatus.value = 'Iniciando scraping...';

  try {
    scrapingStatus.value = 'Obteniendo datos de equipos...';

    const result = await scrapingViewModel.scrapeTeamsByLeague(
      selectedLeague.value,
      scrapingOptions.value,
    );

    scrapingStatus.value = 'Scraping completado exitosamente';
    scrapingCompleted.value = true;

    emit('scraping-completed', result);
  } catch (error) {
    scrapingStatus.value = 'Error durante el scraping';
    scrapingCompleted.value = true;
    console.error('Scraping error:', error);
  }
};

const finishScraping = () => {
  closeDialog();
};

const resetScraping = () => {
  currentStep.value = 1;
  selectedLeague.value = null;
  leagueSearch.value = '';
  scrapingCompleted.value = false;
  scrapingStatus.value = '';
  scrapingOptions.value = {
    createMissing: true,
    updateExisting: true,
    preserveManualData: true,
    includeInactive: false,
    isQueensLeague: false,
    nameFilter: '',
  };
};

const closeDialog = () => {
  emit('update:modelValue', false);
  // Reset after animation
  setTimeout(() => {
    resetScraping();
  }, 300);
};

const formatDuration = (duration: number): string => {
  if (duration < 1000) {
    return `${duration}ms`;
  } else if (duration < 60000) {
    return `${Math.round(duration / 1000)}s`;
  } else {
    return `${Math.round(duration / 60000)}m ${Math.round((duration % 60000) / 1000)}s`;
  }
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetScraping();
    }
  },
);
</script>
