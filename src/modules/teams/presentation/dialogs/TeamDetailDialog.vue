<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column full-height">
      <q-toolbar class="bg-primary text-white">
        <q-avatar v-if="selectedTeam.logoUrl">
          <img :src="selectedTeam.logoUrl" :alt="`${selectedTeam.name} logo`" />
        </q-avatar>
        <q-toolbar-title>
          <span class="q-ml-sm">Detalles del Equipo</span>
        </q-toolbar-title>
        <q-space />

        <q-btn flat round dense icon="edit" @click="onEditTeam" class="q-mr-sm">
          <q-tooltip content-class="bg-secondary">Editar Equipo</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="delete" @click="onDeleteTeam" class="q-mr-sm">
          <q-tooltip content-class="bg-negative">Eliminar Equipo</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-card-section v-if="selectedTeam.id" class="col scroll q-pa-md">
        <div class="row q-col-gutter-lg items-start">
          <div class="col-12 col-md-3 col-lg-2 text-center q-mb-md q-mb-md-none">
            <q-img
              v-if="selectedTeam.logoUrl"
              :src="selectedTeam.logoUrl"
              style="
                max-height: 200px;
                width: auto;
                max-width: 100%;
                border-radius: 8px;
                margin: 0 auto;
              "
              fit="contain"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">Sin logo</div>
              </template>
            </q-img>
            <q-icon v-else name="shield" size="100px" color="grey-5" class="q-my-md" />
            <div class="text-h5 q-mt-sm">{{ selectedTeam.name }}</div>
            <div v-if="selectedTeam.abbr" class="text-subtitle1 text-grey">
              ({{ selectedTeam.abbr }})
            </div>
          </div>

          <div class="col-12 col-md-9 col-lg-10">
            <q-list bordered separator padding class="rounded-borders bg-white">
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="sports_soccer" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Nombre del Equipo</q-item-label>
                  <q-item-label class="text-body1">{{ selectedTeam.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="place" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Ciudad</q-item-label>
                  <q-item-label class="text-body1">{{
                    selectedTeam.city || 'No disponible'
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="public" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>País</q-item-label>
                  <q-item-label class="text-body1">{{
                    selectedTeam.country || 'No disponible'
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="
                  selectedTeam.foundationYear !== null && selectedTeam.foundationYear !== undefined
                "
              >
                <q-item-section avatar>
                  <q-icon color="primary" name="event" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Año de Fundación</q-item-label>
                  <q-item-label class="text-body1">{{ selectedTeam.foundationYear }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="selectedTeam.venue">
                <q-item-section avatar>
                  <q-icon color="primary" name="stadium" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Estadio/Sede</q-item-label>
                  <q-item-label class="text-body1">{{ selectedTeam.venue }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="emoji_events" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>ID de Liga</q-item-label>
                  <q-item-label class="text-body1">{{ selectedTeam.leagueId }}</q-item-label>
                  <!-- Podrías querer mostrar el nombre de la liga aquí si lo tienes disponible -->
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="fingerprint" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>UUID del Equipo</q-item-label>
                  <q-item-label class="text-caption" style="word-break: break-all">{{
                    selectedTeam.uuid
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="link" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Slug</q-item-label>
                  <q-item-label class="text-body1">{{ selectedTeam.slug }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="schedule" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Fecha de Creación</q-item-label>
                  <q-item-label class="text-body1">{{
                    formatDate(selectedTeam.createdAt)
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="update" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Última Actualización</q-item-label>
                  <q-item-label class="text-body1">{{
                    formatDate(selectedTeam.updatedAt)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else class="col flex flex-center">
        <div class="text-center">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-md">Cargando datos del equipo...</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { Team } from 'src/modules/teams/domain/entities/team.entity';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  selectedTeam: {
    type: Team,
    required: true,
  },
});

const formatDate = (dateString: Date) => {
  if (!dateString) return 'No disponible';
  return date.formatDate(dateString, 'DD/MM/YYYY HH:mm');
};

const emit = defineEmits(['update:modelValue', 'edit-team', 'delete-team']);

const onEditTeam = () => {
  emit('edit-team', props.selectedTeam);
};

const onDeleteTeam = () => {
  emit('delete-team', props.selectedTeam);
};
</script>

<style scoped></style>
