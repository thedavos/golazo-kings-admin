<template>
  <q-dialog
    v-model="isOpen"
    persistent
    max-width="900px"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="player-dialog">
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
          <player-form-fields
            v-model:form="form"
            :loading-teams="loadingTeams"
            :team-options="teamOptions"
            :position-options="positionOptions"
            :nationality-options="nationalityOptions"
            :preferred-foot-options="preferredFootOptions"
            :wild-card-type-options="wildCardTypeOptions"
            :min-birth-date="minBirthDate"
            :max-birth-date="maxBirthDate"
            :player-age="playerAge"
            :first-name-rules="firstNameRules"
            :last-name-rules="lastNameRules"
            :email-rules="emailRules"
            :birth-date-rules="birthDateRules"
            :jersey-number-rules="jerseyNumberRules"
            :height-rules="heightRules"
            :weight-rules="weightRules"
            :url-rules="logoUrlRules"
            :filter-nationalities="filterNationalities"
            :preview-photo="previewPhoto"
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
import { usePlayerDetailsStore } from 'src/modules/players/stores/playerDetails.store';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { usePlayerForm } from 'src/modules/players/composables/usePlayerForm';
import { usePlayerDialog } from 'src/modules/players/composables/usePlayerDialog';
import PlayerFormFields from 'src/modules/players/presentation/components/PlayerFormFields.vue';

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
  (e: 'created', playerId: number): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Composables
const playerStore = usePlayerDetailsStore();
const notifications = useQuasarNotifications();

const playerForm = usePlayerForm({ mode: 'create' });
const playerDialog = usePlayerDialog({ mode: 'create' });

// Destructure composables
const {
  form,
  loadingTeams,
  teamOptions,
  positionOptions,
  nationalityOptions,
  preferredFootOptions,
  wildCardTypeOptions,
  minBirthDate,
  maxBirthDate,
  isFormValid,
  playerAge,
  firstNameRules,
  lastNameRules,
  emailRules,
  birthDateRules,
  jerseyNumberRules,
  heightRules,
  weightRules,
  logoUrlRules,
  loadTeams,
  filterNationalities,
  previewPhoto,
  onImageError,
  resetForm,
} = playerForm;

const { dialogTitle, dialogIcon, submitButtonLabel } = playerDialog;

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = computed(() => props.loading || playerStore.loadings.create);

// Methods
const onSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    const newPlayer = await playerStore.createPlayer(form);
    notifications.notifySuccess(`Jugador ${newPlayer.fullName} creado exitosamente`);
    emit('created', newPlayer.id);
    resetForm();
    emit('close');
  } catch (error) {
    console.error('Error creating player:', error);
  }
};

const onCancel = () => {
  resetForm();
  emit('close');
};

// Initialize
onMounted(async () => {
  await loadTeams();
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
.player-dialog {
  width: 100%;
  max-width: 900px;
}

@media (max-width: 600px) {
  .player-dialog {
    max-width: 100%;
  }
}
</style>
