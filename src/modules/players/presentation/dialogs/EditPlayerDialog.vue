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
          :disable="!isFormValid || !hasChanges"
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
import type { Player } from 'src/modules/players/domain/entities/player.entity';

// Props
interface Props {
  modelValue: boolean;
  player: Player;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved', player: Player): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Composables
const playerStore = usePlayerDetailsStore();
const notifications = useQuasarNotifications();

const playerForm = usePlayerForm({
  initialData: props.player,
  mode: 'edit',
});

const playerDialog = usePlayerDialog({
  mode: 'edit',
  hasChanges: () => playerForm.hasChanges.value,
});

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
  hasChanges,
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
  populateForm,
} = playerForm;

const { dialogTitle, dialogIcon, submitButtonLabel, confirmCancel } = playerDialog;

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = computed(() => props.loading || playerStore.loadings.update);

// Methods
const onSubmit = async () => {
  if (!isFormValid.value || !hasChanges.value) return;

  try {
    const updatedPlayer = await playerStore.updatePlayer(props.player.id, props.player.uuid, form);
    notifications.notifySuccess(`Jugador ${updatedPlayer.fullName} actualizado exitosamente`);
    emit('saved', updatedPlayer);
    emit('close');
  } catch (error) {
    console.error('Error updating player:', error);
  }
};

const onCancel = async () => {
  const shouldClose = await confirmCancel();
  if (shouldClose) {
    resetForm();
    emit('close');
  }
};

// Initialize
onMounted(async () => {
  await loadTeams();
  populateForm(props.player);
});

// Update form when player prop changes
watch(
  () => props.player,
  (newPlayer) => {
    if (newPlayer) {
      populateForm(newPlayer);
    }
  },
  { deep: true },
);

// Reset form when dialog opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.player) {
      populateForm(props.player);
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
