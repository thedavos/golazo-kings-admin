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
      <q-card-section class="row items-center q-pa-md bg-primary text-white">
        <q-icon name="add_circle" size="md" class="q-mr-md" />
        <div class="text-h6">Crear Nueva Liga</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <!-- Form Content -->
      <q-card-section class="col q-pa-md scroll">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="row q-gutter-md">
            <!-- Basic Information -->
            <div class="col-12">
              <div class="text-h6 q-mb-md">Información Básica</div>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="Nombre de la Liga *"
                filled
                :rules="[(val) => !!val || 'El nombre es requerido']"
                lazy-rules
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.abbr"
                label="Abreviación *"
                filled
                :rules="[(val) => !!val || 'La abreviación es requerida']"
                lazy-rules
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.slug"
                label="Slug *"
                filled
                :rules="[(val) => !!val || 'El slug es requerido']"
                lazy-rules
                hint="Se usa para URLs amigables"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.description"
                label="Descripción *"
                filled
                type="textarea"
                rows="3"
                :rules="[(val) => !!val || 'La descripción es requerida']"
                lazy-rules
              />
            </div>

            <!-- Location -->
            <div class="col-12">
              <div class="text-h6 q-mb-md q-mt-lg">Ubicación</div>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.country"
                label="País *"
                filled
                :rules="[(val) => !!val || 'El país es requerido']"
                lazy-rules
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.city"
                label="Ciudad *"
                filled
                :rules="[(val) => !!val || 'La ciudad es requerida']"
                lazy-rules
              />
            </div>

            <!-- Configuration -->
            <div class="col-12">
              <div class="text-h6 q-mb-md q-mt-lg">Configuración</div>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.numberOfTeams"
                label="Número de Equipos *"
                filled
                type="number"
                min="2"
                :rules="[
                  (val) => !!val || 'El número de equipos es requerido',
                  (val) => val >= 2 || 'Debe tener al menos 2 equipos',
                ]"
                lazy-rules
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.status"
                label="Estado"
                filled
                :options="statusOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
            </div>

            <!-- Optional Information -->
            <div class="col-12">
              <div class="text-h6 q-mb-md q-mt-lg">Información Opcional</div>
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.logoUrl" label="URL del Logo" filled type="url" />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.foundationYear"
                label="Año de Fundación"
                filled
                type="number"
                min="1800"
                :max="currentYear"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.website" label="Sitio Web" filled type="url" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.twitterHandle" label="Twitter Handle" filled prefix="@" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.instagramHandle" label="Instagram Handle" filled prefix="@" />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.rules"
                label="Reglas"
                filled
                type="textarea"
                rows="4"
                hint="Reglas específicas de la liga"
              />
            </div>

            <!-- Toggles -->
            <div class="col-12">
              <div class="text-h6 q-mb-md q-mt-lg">Configuración de Visibilidad</div>
            </div>

            <div class="col-12 col-md-6">
              <q-toggle v-model="form.isActive" label="Liga Activa" color="positive" />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle v-model="form.isVisible" label="Visible Públicamente" color="primary" />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Actions -->
      <q-card-section class="q-pa-md bg-grey-1">
        <div class="row q-gutter-sm justify-end">
          <q-btn flat label="Cancelar" color="grey-8" @click="close" :disable="loading" />
          <q-btn flat label="Limpiar" color="orange" @click="onReset" :disable="loading" />
          <q-btn
            label="Crear Liga"
            color="primary"
            icon="add"
            @click="onSubmit"
            :loading="loading"
            :disable="loading"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';
import { ValidationUtils } from 'src/modules/shared/utils/validation.util';
import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';

// Props
interface Props {
  modelValue: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: CreateLeagueDto): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentYear = computed(() => new Date().getFullYear());

const statusOptions = computed(() => [
  { label: 'Borrador', value: LeagueStatus.DRAFT },
  { label: 'Activo', value: LeagueStatus.ACTIVE },
  { label: 'Inactivo', value: LeagueStatus.INACTIVE },
  { label: 'Archivado', value: LeagueStatus.ARCHIVED },
]);

// Form state
const initialFormState = {
  name: '',
  slug: '',
  abbr: '',
  country: '',
  city: '',
  logoUrl: '',
  foundationYear: null as number | null,
  website: '',
  twitterHandle: '',
  instagramHandle: '',
  numberOfTeams: 12,
  description: '',
  rules: '',
  status: LeagueStatus.DRAFT,
  isActive: false,
  isVisible: true,
};

const form = reactive<CreateLeagueDto>({ ...initialFormState });

// Auto-generate slug from name
watch(
  () => form.name,
  (newName) => {
    if (newName && !form.slug) {
      form.slug = ValidationUtils.generateSlug(newName);
    }
  },
);

// Methods
const onSubmit = () => {
  const formData: CreateLeagueDto = {
    name: form.name,
    slug: form.slug,
    abbr: form.abbr,
    country: form.country,
    city: form.city,
    numberOfTeams: form.numberOfTeams,
    description: form.description,
    status: form.status,
    isActive: form.isActive,
    isVisible: form.isVisible,
    rules: form.rules,
    logoUrl: form.logoUrl,
    website: form.website,
    twitterHandle: form.twitterHandle,
    instagramHandle: form.instagramHandle,
    foundationYear: form.foundationYear,
  };

  emit('submit', formData);
};

const onReset = () => {
  Object.assign(form, initialFormState);
};

const close = () => {
  emit('close');
};

// Reset form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      onReset();
    }
  },
);
</script>
