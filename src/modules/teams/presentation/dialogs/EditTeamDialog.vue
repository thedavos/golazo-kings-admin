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
          :disable="!hasChanges || !isFormValid"
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
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { UpdateTeamDto } from 'src/modules/teams/dtos/update-team.dto';

// Props
interface Props {
  modelValue: boolean;
  team: Team;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved', team: Team): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Composables
const teamStore = useTeamDetailsStore();
const notifications = useQuasarNotifications();

const teamForm = useTeamForm({
  mode: 'edit',
  initialData: props.team,
});

const teamDialog = useTeamDialog({
  mode: 'edit',
  hasChanges: () => teamForm.hasChanges.value,
});

// Destructure composables
const {
  form,
  loadingLeagues,
  leagueOptions,
  countryOptions,
  currentYear,
  isFormValid,
  hasChanges,
  nameRules,
  cityRules,
  countryRules,
  logoUrlRules,
  abbrRules,
  loadLeagues,
  filterCountries,
  previewLogo,
  onImageError,
  populateForm,
} = teamForm;

const { dialogTitle, dialogIcon, submitButtonLabel, confirmCancel } = teamDialog;

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = computed(() => props.loading || teamStore.loadingUpdate);

// Methods
const onSubmit = async () => {
  if (!isFormValid.value || !hasChanges.value) return;

  try {
    const updateData: UpdateTeamDto = {
      ...form,
    };

    const updatedTeam = await teamStore.updateTeam(props.team.uuid, updateData);
    notifications.notifySuccess(`Equipo ${updatedTeam.name} actualizado exitosamente`);
    emit('saved', updatedTeam);
    emit('close');
  } catch (error) {
    console.error('Error updating team:', error);
  }
};

const onCancel = async () => {
  const canCancel = await confirmCancel();
  if (canCancel) {
    emit('close');
  }
};

// Initialize
onMounted(async () => {
  await loadLeagues();
});

// Populate form when team prop changes
watch(
  () => props.team,
  (newTeam) => {
    if (newTeam) {
      populateForm(newTeam);
    }
  },
  { immediate: true },
);

// Populate form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.team) {
      populateForm(props.team);
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
