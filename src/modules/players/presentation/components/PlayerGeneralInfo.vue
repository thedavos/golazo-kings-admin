<template>
  <div class="player-general-info">
    <div class="row q-col-gutter-lg">
      <!-- Información Personal -->
      <div class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="person" class="q-mr-sm" />
              <p class="q-my-auto">Información Personal</p>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nombre Completo</q-item-label>
                  <q-item-label>{{ player.fullName }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.nickname">
                <q-item-section>
                  <q-item-label caption>Apodo</q-item-label>
                  <q-item-label>{{ player.nickname }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.birthDate">
                <q-item-section>
                  <q-item-label caption>Fecha de Nacimiento</q-item-label>
                  <q-item-label>
                    {{ formatDate(player.birthDate) }}
                    <span v-if="playerAge" class="text-grey-6">({{ playerAge }} años)</span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.nationality">
                <q-item-section>
                  <q-item-label caption>Nacionalidad</q-item-label>
                  <q-item-label>{{ player.nationality }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.socialMediaHandle">
                <q-item-section>
                  <q-item-label caption>Redes Sociales</q-item-label>
                  <q-item-label>{{ player.socialMediaHandle }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Información Deportiva -->
      <div class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="sports_soccer" class="q-mr-sm" />
              <p class="q-my-auto">Información Deportiva</p>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Equipo</q-item-label>
                  <q-item-label>
                    <q-chip color="primary" text-color="white">
                      {{ player.team?.name || 'Sin equipo asignado' }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.position">
                <q-item-section>
                  <q-item-label caption>Posición</q-item-label>
                  <q-item-label>{{ player.position }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.jerseyNumber">
                <q-item-section>
                  <q-item-label caption>Número de Camiseta</q-item-label>
                  <q-item-label># {{ player.jerseyNumber }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.preferredFoot">
                <q-item-section>
                  <q-item-label caption>Pierna Dominante</q-item-label>
                  <q-item-label>{{ getPreferredFootLabel(player.preferredFoot) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado</q-item-label>
                  <q-item-label>
                    <q-badge :color="player.isActive ? 'positive' : 'negative'">
                      {{ player.isActive ? 'Activo' : 'Inactivo' }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.formerTeam">
                <q-item-section>
                  <q-item-label caption>Equipo Anterior</q-item-label>
                  <q-item-label>{{ player.formerTeam }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Características Físicas -->
      <div class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="fitness_center" class="q-mr-sm" />
              <p class="q-my-auto">Características Físicas</p>
            </div>

            <q-list>
              <q-item v-if="player.height">
                <q-item-section>
                  <q-item-label caption>Altura</q-item-label>
                  <q-item-label>{{ player.height }} cm</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.weight">
                <q-item-section>
                  <q-item-label caption>Peso</q-item-label>
                  <q-item-label>{{ player.weight }} kg</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.bmi">
                <q-item-section>
                  <q-item-label caption>IMC</q-item-label>
                  <q-item-label>{{ player.bmi.toFixed(2) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Información Wildcard -->
      <div v-if="player.isWildCard" class="col-md-6 col-xs-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="flex items-center text-h6 q-mb-md">
              <q-icon name="star" class="q-mr-sm" />
              <p class="q-my-auto">Información Wildcard</p>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Tipo de Wildcard</q-item-label>
                  <q-item-label>
                    <q-badge color="amber" text-color="black">
                      {{ getWildcardTypeLabel(player.wildCardType) }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.wildCardDescription">
                <q-item-section>
                  <q-item-label caption>Descripción</q-item-label>
                  <q-item-label>{{ player.wildCardDescription }}</q-item-label>
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
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import { getAge } from 'src/modules/shared/utils/getAge.util';

interface Props {
  player: Player;
}

const props = defineProps<Props>();

const playerAge = computed(() => {
  if (!props.player.birthDate) return null;
  return getAge(props.player.birthDate);
});

const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getPreferredFootLabel = (foot: string | null | undefined): string => {
  if (!foot) return 'No especificado';

  const footMap: Record<string, string> = {
    right: 'Diestro',
    left: 'Zurdo',
    both: 'Ambidiestro',
  };

  return footMap[foot] || foot;
};

const getWildcardTypeLabel = (type: string | null | undefined): string => {
  if (!type) return 'Wildcard';

  const typeMap: Record<string, string> = {
    special_guest: 'Invitado Especial',
    streamer: 'Streamer',
    influencer: 'Influencer',
    legend: 'Leyenda',
    first_division: 'Primera División',
    second_division: 'Segunda División',
    regular: 'Regular',
  };

  return typeMap[type] || 'Wildcard';
};
</script>

<style lang="scss" scoped>
.player-general-info {
  .q-card {
    height: 100%;
  }
}
</style>
