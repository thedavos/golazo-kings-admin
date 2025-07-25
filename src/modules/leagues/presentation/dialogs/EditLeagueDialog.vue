<template>
  <q-dialog v-model="isOpen" persistent max-width="800px">
    <q-card class="edit-league-dialog">
      <!-- Header -->
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon name="edit" size="sm" class="q-mr-sm" />
        <div class="text-h6">Editar Liga</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onCancel" />
      </q-card-section>

      <!-- Form Content -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- Sección 1: Información Básica -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="flex items-center text-h6 q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                <p class="q-my-auto">Información Básica</p>
              </div>

              <div class="row q-col-gutter-x-md">
                <q-input
                  v-model="form.name"
                  outlined
                  dense
                  label="Nombre de la Liga *"
                  class="col-md-6 col-xs-12"
                  :rules="nameRules"
                />

                <q-input
                  v-model="form.abbr"
                  outlined
                  dense
                  maxlength="5"
                  label="Abreviación *"
                  class="col-md-6 col-xs-12"
                  :rules="abbrRules"
                />
              </div>

              <q-input
                v-model="form.description"
                outlined
                dense
                rows="3"
                label="Descripción"
                type="textarea"
                class="full-width"
              />
            </q-card-section>
          </q-card>

          <!-- Sección 2: Ubicación -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="flex items-center text-h6 q-mb-md">
                <q-icon name="place" class="q-mr-sm" />
                <p class="q-my-auto">Ubicación</p>
              </div>

              <div class="row q-col-gutter-x-md">
                <q-input
                  v-model="form.city"
                  outlined
                  dense
                  class="col-md-6 col-xs-12"
                  label="Ciudad *"
                  :rules="cityRules"
                />

                <q-select
                  v-model="form.country"
                  outlined
                  dense
                  use-input
                  input-debounce="300"
                  label="País *"
                  class="col-md-6 col-xs-12"
                  :rules="countryRules"
                  :options="countryOptions"
                  @filter="filterCountries"
                />
              </div>

              <div class="row q-col-gutter-x-md">
                <q-input
                  v-model="form.venue"
                  outlined
                  dense
                  label="Estadio/Sede"
                  class="col-md-6 col-xs-12"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Sección 3: Configuración -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="flex items-center text-h6 q-mb-md">
                <q-icon name="settings" class="q-mr-sm" />
                <p class="q-my-auto">Configuración</p>
              </div>

              <div class="row q-col-gutter-x-md">
                <q-input
                  v-model.number="form.numberOfTeams"
                  outlined
                  dense
                  min="2"
                  max="64"
                  label="Número de Equipos"
                  type="number"
                  class="col-md-4 col-xs-12"
                  :rules="numberOfTeamsRules"
                />

                <q-select
                  v-model="form.status"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="col-md-4 col-xs-12"
                  label="Estado *"
                  :options="statusOptions"
                  :rules="statusRules"
                />

                <q-input
                  v-model.number="form.foundationYear"
                  label="Año de Fundación"
                  type="number"
                  outlined
                  dense
                  :min="1800"
                  :max="currentYear"
                  class="col-md-4 col-xs-12"
                  :rules="foundationYearRules"
                />
              </div>

              <div class="row">
                <q-toggle
                  v-model="form.isActive"
                  label="Liga Activa"
                  color="positive"
                  class="col-auto"
                />
                <q-toggle
                  v-model="form.isVisible"
                  label="Liga Visible"
                  color="info"
                  class="col-auto"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Sección 4: Multimedia y Enlaces -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="flex items-center text-h6 q-mb-md">
                <q-icon name="link" class="q-mr-sm" />
                <p class="q-my-auto">Multimedia y Enlaces</p>
              </div>

              <div class="row column">
                <div class="col-md-2 col-xs-12 text-center q-pa-md">
                  <q-avatar size="60px" class="bg-grey-2">
                    <img
                      v-if="form.logoUrl && isValidUrl(form.logoUrl)"
                      alt="Logo URL"
                      :src="form.logoUrl"
                      @error="onImageError"
                    />
                    <q-icon v-else name="sports_soccer" color="grey-6" />
                  </q-avatar>
                  <div class="text-caption q-mt-xs">Vista previa</div>
                </div>

                <div class="col-md-8 col-xs-12">
                  <q-input
                    v-model="form.logoUrl"
                    outlined
                    dense
                    bottom-slots
                    label="URL del Logo"
                    :rules="logoUrlRules"
                  >
                    <template v-slot:append>
                      <q-btn
                        flat
                        round
                        dense
                        icon="visibility"
                        @click="previewLogo"
                        :disable="!form.logoUrl"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-col-gutter-x-md">
                <q-input
                  v-model="form.website"
                  label="Sitio Web"
                  outlined
                  dense
                  class="col-md-5 col-md-grow col-xs-12"
                  :rules="websiteRules"
                  prefix="https://"
                />

                <q-input
                  v-model="form.socialMediaHandle"
                  label="Redes Sociales"
                  outlined
                  dense
                  class="col-md-5 col-md-grow col-xs-12"
                  hint="Handle de Twitter/Instagram (sin @)"
                  prefix="@"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg">
        <q-btn flat label="Cancelar" @click="onCancel" />
        <q-btn
          color="primary"
          label="Guardar Cambios"
          type="submit"
          :loading="isLoading"
          :disable="!hasChanges || !isFormValid"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useLeagueDetailsStore } from 'src/modules/leagues/stores/leagueDetails.store';
import { useRules } from 'src/composables/useRules';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';
import type { UpdateLeagueDto } from 'src/modules/leagues/dtos/update-league.dto';

interface Props {
  modelValue: boolean;
  league: League;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'saved', updatedLeague: League): void;
}

interface UpdateLeagueForm extends Partial<UpdateLeagueDto> {
  socialMediaHandle: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const $q = useQuasar();
const leagueStore = useLeagueDetailsStore();
const notifications = useQuasarNotifications();
const {
  nameRules,
  abbrRules,
  cityRules,
  countryRules,
  foundationYearRules,
  numberOfTeamsRules,
  statusRules,
  websiteRules,
  logoUrlRules,
} = useRules();

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = computed(() => leagueStore.updateLoading);
const currentYear = new Date().getFullYear();

// Form reactive state
const form = reactive<UpdateLeagueForm>({
  name: '',
  abbr: '',
  description: '',
  city: '',
  country: '',
  logoUrl: '',
  numberOfTeams: 12,
  status: LeagueStatus.DRAFT,
  isActive: true,
  isVisible: true,
  foundationYear: null,
  venue: '',
  website: '',
  socialMediaHandle: '',
});

// Original data for change detection
const originalData = ref<UpdateLeagueDto>({});

// Filter options
const countryOptions = ref<string[]>([]);
const statusOptions = [
  { label: 'Borrador', value: LeagueStatus.DRAFT },
  { label: 'Activa', value: LeagueStatus.ACTIVE },
  { label: 'Inactiva', value: LeagueStatus.INACTIVE },
  { label: 'Archivada', value: LeagueStatus.ARCHIVED },
];

// Computed properties
const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalData.value);
});

const isFormValid = computed(() => {
  return (
    !!form.name &&
    !!form.abbr &&
    !!form.city &&
    !!form.country &&
    form.name.length >= 3 &&
    form.abbr.length <= 5
  );
});

// Methods
const initForm = () => {
  // Map social media handles
  const socialMediaHandle = props.league.twitterHandle || props.league.instagramHandle || '';

  // Initialize form with league data
  Object.assign(form, {
    id: props.league.id,
    name: props.league.name,
    abbr: props.league.abbr,
    description: props.league.description,
    city: props.league.city,
    country: props.league.country,
    logoUrl: props.league.logoUrl,
    numberOfTeams: props.league.numberOfTeams,
    status: props.league.status,
    isActive: props.league.isActive,
    isVisible: props.league.isVisible,
    foundationYear: props.league.foundationYear,
    website: props.league.website ? props.league.website.replace('https://', '') : '',
    socialMediaHandle: socialMediaHandle,
  });

  // Store original data for change detection
  originalData.value = { ...form };
};

const resetForm = () => {
  initForm();
};

const onSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    const socialMediaHandle = form.socialMediaHandle || '';

    // Prepare data for submission
    const updateData: UpdateLeagueDto = {
      ...form,
      // Format website URL if provided
      website: form.website ? `https://${form.website}` : null,
      // Split social media handle into Twitter and Instagram
      twitterHandle: socialMediaHandle || null,
      instagramHandle: null,
    };

    // Submit the form
    const updatedLeague = await leagueStore.updateLeague(updateData);

    // Emit saved event with updated league
    emit('saved', updatedLeague);

    // Close the dialog
    emit('close');
  } catch (error) {
    console.error('Error updating league:', error);
  }
};

const onCancel = () => {
  if (hasChanges.value) {
    $q.dialog({
      title: 'Confirmar',
      message: '¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      resetForm();
      emit('close');
    });
  } else {
    emit('close');
  }
};

const filterCountries = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      countryOptions.value = [
        'España',
        'México',
        'Argentina',
        'Colombia',
        'Chile',
        'Estados Unidos',
      ];
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    countryOptions.value = [
      'España',
      'México',
      'Argentina',
      'Colombia',
      'Chile',
      'Estados Unidos',
    ].filter((v) => v.toLowerCase().indexOf(needle) > -1);
  });
};

const previewLogo = () => {
  if (form.logoUrl && isValidUrl(form.logoUrl)) {
    $q.dialog({
      title: 'Vista previa del logo',
      message: `<img src="${form.logoUrl}" alt="${form.name}" style="max-width: 300px; max-height: 300px;"/>`,
      html: true,
    });
  }
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '';
  notifications.notifyWarning('Error al cargar la imagen');
};

// Initialize form when the component is mounted
onMounted(() => {
  initForm();
});

// Watch for changes in the league prop
watch(
  () => props.league,
  () => {
    initForm();
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.edit-league-dialog {
  width: 100%;
  max-width: 800px;
}

@media (max-width: 600px) {
  .edit-league-dialog {
    max-width: 100%;
  }
}
</style>
