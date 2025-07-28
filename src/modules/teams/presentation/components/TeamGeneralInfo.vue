<template>
  <div class="team-general-info">
    <div class="row q-col-gutter-md">
      <!-- Basic Information -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="info" class="q-mr-sm" />
              <p class="q-my-auto">Información Básica</p>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nombre</q-item-label>
                  <q-item-label>{{ team.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="team.abbr">
                <q-item-section>
                  <q-item-label caption>Abreviación</q-item-label>
                  <q-item-label>{{ team.abbr }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Tipo</q-item-label>
                  <q-item-label>
                    <q-chip
                      :color="team.isQueensLeagueTeam ? 'pink' : 'primary'"
                      text-color="white"
                      :label="team.isQueensLeagueTeam ? 'Queens League' : 'Kings League'"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="team.foundationYear">
                <q-item-section>
                  <q-item-label caption>Año de Fundación</q-item-label>
                  <q-item-label>{{ team.foundationYear }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Location Information -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="place" class="q-mr-sm" />
              <p class="q-my-auto">Ubicación</p>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Ciudad</q-item-label>
                  <q-item-label>{{ team.city }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>País</q-item-label>
                  <q-item-label>{{ team.country }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="team.venue">
                <q-item-section>
                  <q-item-label caption>Estadio/Sede</q-item-label>
                  <q-item-label>{{ team.venue }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- League Information -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="emoji_events" class="q-mr-sm" />
              <p class="q-my-auto">Liga</p>
            </div>

            <q-list v-if="team.leagueId">
              <q-item>
                <q-item-section>
                  <q-item-label caption>Liga</q-item-label>
                  <q-item-label>
                    <q-chip
                      color="info"
                      text-color="white"
                      :label="leagueName || `Liga ID: ${team.leagueId}`"
                      size="sm"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-grey-6 q-pa-md text-center">
              Este equipo no está asignado a ninguna liga
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- External References -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="link" class="q-mr-sm" />
              <p class="q-my-auto">Referencias Externas</p>
            </div>

            <q-list v-if="hasExternalReferences">
              <q-item v-if="team.referenceId">
                <q-item-section>
                  <q-item-label caption>ID de Referencia</q-item-label>
                  <q-item-label>{{ team.referenceId }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="externalReferenceUrl">
                <q-item-section>
                  <q-item-label caption>URL de Referencia</q-item-label>
                  <q-item-label>
                    <a :href="externalReferenceUrl" target="_blank" rel="noopener noreferrer">
                      {{ externalReferenceUrl }}
                      <q-icon name="open_in_new" size="xs" />
                    </a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-grey-6 q-pa-md text-center">
              No hay referencias externas disponibles
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- System Information -->
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="settings" class="q-mr-sm" />
              <p class="q-my-auto">Metadata</p>
            </div>

            <q-list class="row">
              <q-item class="col-12 col-md-6">
                <q-item-section>
                  <q-item-label caption>ID</q-item-label>
                  <q-item-label>{{ team.id }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="col-12 col-md-6">
                <q-item-section>
                  <q-item-label caption>UUID</q-item-label>
                  <q-item-label class="text-truncate">{{ team.uuid }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="col-12 col-md-6">
                <q-item-section>
                  <q-item-label caption>Creado</q-item-label>
                  <q-item-label>{{ formatDate(team.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="col-12 col-md-6">
                <q-item-section>
                  <q-item-label caption>Actualizado</q-item-label>
                  <q-item-label>{{ formatDate(team.updatedAt) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { date } from 'quasar';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

interface Props {
  team: Team;
  leagueName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  leagueName: '',
});

const hasExternalReferences = computed(() => {
  return !!props.team.referenceId || !!props.team.referenceUrl;
});

const baseReferenceUrl = computed(() =>
  props.team.isQueensLeagueTeam ? process.env.QUEENS_LEAGUE_URL : process.env.KINGS_LEAGUE_URL,
);
const externalReferenceUrl = computed(
  () => `${baseReferenceUrl.value}/equipos/${props.team.referenceUrl}`,
);

const formatDate = (dateValue: Date) => {
  return date.formatDate(dateValue, 'DD/MM/YYYY HH:mm');
};
</script>

<style lang="scss" scoped>
.team-general-info {
  .q-card {
    height: 100%;
  }
}
</style>
