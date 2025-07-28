<template>
  <q-dialog
    v-model="isOpen"
    persistent
    max-width="800px"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="team-dialog">
      <!-- Header -->
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon :name="dialogIcon" size="sm" class="q-mr-sm" />
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onCancel" />
      </q-card-section>

      <!-- Form Content -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <team-form-fields
            v-model:form="form"
            :loading-leagues="loadingLeagues"
            :league-options="leagueOptions"
            :country-options="countryOptions"
            :current-year="currentYear"
            :name-rules="nameRules"
            :city-rules="cityRules"
            :country-rules="countryRules"
            :logo-url-rules="logoUrlRules"
            :abbr-rules="abbrRules"
            :filter-countries="filterCountries"
            :preview-logo="previewLogo"
            :on-image-error="onImageError"
          />
        </q-form>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg">
        <q-btn flat label="Cancelar" @click="onCancel" />
        <q-btn
          color="primary"
          :label="submitButtonLabel"
          :loading="isLoading"
          :disable="!isFormValid"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useTeamDetailsStore } from 'src/modules/teams/stores/teamDetails.store';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useTeamForm } from 'src/modules/teams/composables/useTeamForm';
import { useTeamDialog } from 'src/modules/teams/composables/useTeamDialog';
import TeamFormFields from 'src/modules/teams/presentation/components/TeamFormFields.vue';

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
  (e: 'created', teamId: number): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Composables
const teamStore = useTeamDetailsStore();
const notifications = useQuasarNotifications();

const teamForm = useTeamForm({ mode: 'create' });
const teamDialog = useTeamDialog({ mode: 'create' });

// Destructure composables
const {
  form,
  loadingLeagues,
  leagueOptions,
  countryOptions,
  currentYear,
  isFormValid,
  nameRules,
  cityRules,
  countryRules,
  logoUrlRules,
  abbrRules,
  loadLeagues,
  filterCountries,
  previewLogo,
  onImageError,
  resetForm,
} = teamForm;

const { dialogTitle, dialogIcon, submitButtonLabel } = teamDialog;

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = computed(() => props.loading || teamStore.loadingCreate);

// Methods
const onSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    const newTeam = await teamStore.createTeam(form);
    notifications.notifySuccess(`Equipo ${newTeam.name} creado exitosamente`);
    emit('created', newTeam.id);
    resetForm();
    emit('close');
  } catch (error) {
    console.error('Error creating team:', error);
  }
};

const onCancel = () => {
  resetForm();
  emit('close');
};

// Initialize
onMounted(async () => {
  await loadLeagues();
  resetForm();
});

// Reset form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);
</script>

<style lang="scss" scoped>
.team-dialog {
  width: 100%;
  max-width: 800px;
}

@media (max-width: 600px) {
  .team-dialog {
    max-width: 100%;
  }
}
</style>
