<template>
  <div class="team-form-fields">
    <!-- Información Básica -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="info" class="q-mr-sm" />
          <p class="q-my-auto">Información Básica</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <q-input
            v-model="formData.name"
            outlined
            dense
            label="Nombre del Equipo *"
            class="col-md-6 col-xs-12"
            :rules="nameRules"
          />

          <q-input
            v-model="formData.abbr"
            outlined
            dense
            maxlength="5"
            class="col-md-6 col-xs-12"
            label="Abreviación"
            :rules="abbrRules"
          />

          <q-select
            v-model="formData.leagueId"
            label="Liga *"
            outlined
            dense
            emit-value
            map-options
            class="full-width"
            :options="leagueOptions"
            :loading="loadingLeagues"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Ubicación -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="place" class="q-mr-sm" />
          <p class="q-my-auto">Ubicación</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <q-input
            v-model="formData.city"
            label="Ciudad *"
            outlined
            dense
            class="col-md-6 col-xs-12"
            :rules="cityRules"
          />

          <q-select
            v-model="formData.country"
            label="País *"
            outlined
            dense
            use-input
            input-debounce="300"
            class="col-md-6 col-xs-12"
            :options="countryOptions"
            :rules="countryRules"
            @filter="filterCountries"
          />

          <q-input
            v-model="formData.venue"
            outlined
            dense
            label="Estadio/Sede"
            class="full-width"
            hint="Estadio donde juega el equipo ej: Cupra Arena, El Domo, etc."
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Detalles Adicionales -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="calendar_today" class="q-mr-sm" />
          <p class="q-my-auto">Detalles Adicionales</p>
        </div>

        <div class="row q-col-gutter-y-sm q-col-gutter-x-md">
          <q-input
            v-model.number="formData.foundationYear"
            label="Año de Fundación"
            type="number"
            outlined
            dense
            :min="1800"
            :max="currentYear"
            class="col-md-4 col-xs-12"
          />

          <div class="col-md-7 col-xs-12">
            <q-toggle
              v-model="formData.isQueensLeagueTeam"
              label="Equipo de Queens League"
              color="pink"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Logo y Referencias -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="flex items-center text-h6 q-mb-md">
          <q-icon name="image" class="q-mr-sm" />
          <p class="q-my-auto">Logo y Referencias</p>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-md-12 col-xs-12 text-center">
            <div class="text-caption q-mb-xs">Vista previa</div>
            <q-avatar size="60px" class="bg-grey-2">
              <img
                v-if="formData.logoUrl && isValidUrl(formData.logoUrl)"
                alt="Logo del equipo"
                :src="formData.logoUrl"
                @error="onImageError"
              />
              <q-icon v-else name="sports_soccer" color="grey-6" />
            </q-avatar>
          </div>

          <div class="full-width">
            <q-input
              v-model="formData.logoUrl"
              outlined
              dense
              bottom-slots
              label="URL del Logo"
              :rules="logoUrlRules"
            >
              <template v-slot:hint>
                <p>URL de la imagen del logo del equipo</p>
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  @click="previewLogo"
                  :disable="!formData.logoUrl"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <q-input
            v-model.number="formData.referenceId"
            outlined
            dense
            label="ID de Referencia"
            type="number"
            class="col-md-6 col-xs-12"
            hint="ID externo del equipo"
          />

          <q-input
            v-model="formData.referenceUrl"
            outlined
            dense
            label="URL de Referencia"
            class="col-md-6 col-xs-12"
            hint="URL externa del equipo"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';
import type { CreateTeamDto } from 'src/modules/teams/dtos/create-team.dto';

interface Props {
  loadingLeagues: boolean;
  leagueOptions: { label: string; value: number }[];
  countryOptions: string[];
  currentYear: number;
  nameRules: Array<(val: string) => boolean | string>;
  cityRules: Array<(val: string) => boolean | string>;
  countryRules: Array<(val: string) => boolean | string>;
  logoUrlRules: Array<(val: string) => boolean | string>;
  abbrRules: Array<(val: string) => boolean | string>;
  filterCountries: (val: string, update: (callback: () => void) => void) => void;
  previewLogo: () => void;
  onImageError: (event: Event) => void;
}

defineProps<Props>();

const formData = defineModel<CreateTeamDto>('form', {
  required: true,
});
</script>

<style lang="scss" scoped>
.team-form-fields {
  width: 100%;
}
</style>
