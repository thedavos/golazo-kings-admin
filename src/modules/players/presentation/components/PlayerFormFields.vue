<template>
  <div class="player-form-fields">
    <!-- Información Personal -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="person" class="q-mr-sm" />
          <p class="q-my-auto">Información Personal</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <q-input
            v-model="formData.firstName"
            outlined
            dense
            label="Nombre *"
            class="col-md-4 col-xs-12"
            :rules="firstNameRules"
          />

          <q-input
            v-model="formData.lastName"
            outlined
            dense
            label="Apellidos *"
            class="col-md-4 col-xs-12"
            :rules="lastNameRules"
          />

          <q-input
            v-model="formData.nickname"
            outlined
            dense
            label="Apodo"
            class="col-md-4 col-xs-12"
            hint="Nombre por el que se conoce al jugador"
          />

          <q-input
            v-model="formData.birthDate"
            outlined
            dense
            label="Fecha de Nacimiento *"
            type="date"
            class="col-md-6 col-xs-12"
            :min="minBirthDate"
            :max="maxBirthDate"
            :rules="birthDateRules"
          >
            <template v-slot:append>
              <div v-if="playerAge" class="text-caption text-grey-6">{{ playerAge }} años</div>
            </template>
          </q-input>

          <q-select
            v-model="formData.nationality"
            label="Nacionalidad *"
            outlined
            dense
            use-input
            input-debounce="300"
            class="col-md-6 col-xs-12"
            :options="nationalityOptions"
            @filter="filterNationalities"
          />

          <q-select
            v-model="formData.teamId"
            label="Equipo *"
            outlined
            dense
            emit-value
            map-options
            class="col-md-6 col-xs-12"
            :options="teamOptions"
            :loading="loadingTeams"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Información Deportiva -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="sports_soccer" class="q-mr-sm" />
          <p class="q-my-auto">Información Deportiva</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <q-select
            v-model="formData.position"
            label="Posición *"
            outlined
            dense
            class="col-md-4 col-xs-12"
            :options="positionOptions"
          />

          <q-input
            v-model.number="formData.jerseyNumber"
            label="Número de Camiseta"
            type="number"
            outlined
            dense
            :min="1"
            :max="99"
            class="col-md-4 col-xs-12"
            :rules="jerseyNumberRules"
          />

          <q-select
            v-model="formData.preferredFoot"
            label="Pierna Dominante"
            outlined
            dense
            emit-value
            map-options
            class="col-md-4 col-xs-12"
            :options="preferredFootOptions"
          />

          <q-input
            v-model.number="formData.height"
            label="Altura (cm)"
            type="number"
            outlined
            dense
            class="col-md-6 col-xs-12"
            :rules="heightRules"
            hint="Altura en centímetros"
          />

          <q-input
            v-model.number="formData.weight"
            label="Peso (kg)"
            type="number"
            outlined
            dense
            class="col-md-6 col-xs-12"
            :rules="weightRules"
            hint="Peso en kilogramos"
          />

          <div class="col-12">
            <q-toggle v-model="formData.isActive" label="Jugador Activo" color="positive" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Wildcard y Detalles Adicionales -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="star" class="q-mr-sm" />
          <p class="q-my-auto">Wildcard y Detalles Adicionales</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <div class="col-12">
            <q-toggle v-model="formData.isWildCard" label="Es Wildcard" color="warning" />
          </div>

          <q-select
            v-if="formData.isWildCard"
            v-model="formData.wildCardType"
            label="Tipo de Wildcard"
            outlined
            dense
            emit-value
            map-options
            class="col-md-6 col-xs-12"
            :options="wildCardTypeOptions"
          />

          <q-input
            v-if="formData.isWildCard"
            v-model="formData.wildCardDescription"
            outlined
            dense
            label="Descripción de Wildcard"
            class="col-md-6 col-xs-12"
          />

          <q-input
            v-model="formData.formerTeam"
            outlined
            dense
            label="Equipo Anterior"
            class="col-md-6 col-xs-12"
          />

          <q-input
            v-model="formData.socialMediaHandle"
            outlined
            dense
            label="Usuario de Redes Sociales"
            class="col-md-6 col-xs-12"
            hint="@usuario"
          />

          <q-input
            v-model.number="formData.marketValue"
            label="Valor de Mercado (€)"
            type="number"
            outlined
            dense
            class="col-md-6 col-xs-12"
            hint="Valor en euros"
          />

          <q-input
            v-model.number="formData.referenceId"
            outlined
            dense
            label="ID de Referencia"
            type="number"
            class="col-md-6 col-xs-12"
            hint="ID externo del jugador"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Foto -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="photo_camera" class="q-mr-sm" />
          <p class="q-my-auto">Foto</p>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-md-12 col-xs-12 text-center">
            <div class="text-caption q-mb-xs">Vista previa</div>
            <q-avatar size="80px" class="bg-grey-2">
              <q-img
                v-if="formData.profileImageUrl && isValidUrl(formData.profileImageUrl)"
                alt="Foto del jugador"
                fit="cover"
                :src="formData.profileImageUrl"
                @error="onImageError"
              />
              <q-icon v-else name="person" color="grey-6" />
            </q-avatar>
          </div>

          <div class="full-width">
            <q-input
              v-model="formData.profileImageUrl"
              outlined
              dense
              bottom-slots
              label="URL de la Foto"
              :rules="urlRules"
            >
              <template v-slot:hint>
                <p>URL de la imagen del jugador</p>
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  @click="previewPhoto"
                  :disable="!formData.profileImageUrl"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';

interface Props {
  loadingTeams: boolean;
  teamOptions: { label: string; value: number }[];
  positionOptions: string[];
  nationalityOptions: string[];
  preferredFootOptions: { label: string; value: string }[];
  wildCardTypeOptions: { label: string; value: string }[];
  minBirthDate: string;
  maxBirthDate: string;
  playerAge: number | null;
  firstNameRules: Array<(val: string) => boolean | string>;
  lastNameRules: Array<(val: string) => boolean | string>;
  emailRules: Array<(val: string) => boolean | string>;
  birthDateRules: Array<(val: string) => boolean | string>;
  jerseyNumberRules: Array<(val: number) => boolean | string>;
  heightRules: Array<(val: number) => boolean | string>;
  weightRules: Array<(val: number) => boolean | string>;
  urlRules: Array<(val: string) => boolean | string>;
  filterNationalities: (val: string, update: (callback: () => void) => void) => void;
  previewPhoto: () => void;
  onImageError: (event: Event) => void;
}

defineProps<Props>();

const formData = defineModel<CreatePlayerDto>('form', { required: true });
</script>

<style lang="scss" scoped>
.player-form-fields {
  width: 100%;
}
</style>
