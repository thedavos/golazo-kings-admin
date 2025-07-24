<template>
  <div class="league-hero-section q-mb-lg">
    <div
      class="hero-background bg-primary text-center text-white q-pa-md"
      style="min-height: 200px"
    >
      <div class="hero-content row items-center q-pa-md">
        <div class="hero-info col">
          <q-avatar size="80px" class="hero-logo">
            <img v-if="league.logoUrl" :src="league.logoUrl" alt="League logo" />
            <q-icon v-else name="sports_soccer" size="50px" color="white" />
          </q-avatar>
          <h1 class="league-name text-h4 text-weight-medium q-mt-none q-mb-sm text-white">
            {{ league.name }}
          </h1>
          <p class="league-location text-subtitle1 q-mb-none text-white">
            <q-icon name="place" size="sm" />
            {{ league.location }}
          </p>
          <div class="league-status q-mt-sm">
            <q-chip
              :color="getStatusColor(league.status)"
              text-color="white"
              :label="league.status"
              size="sm"
            />
            <q-chip
              :color="league.isActive ? 'positive' : 'negative'"
              text-color="white"
              :label="league.isActive ? 'ACTIVA' : 'INACTIVA'"
              size="sm"
            />
            <q-chip
              :color="league.isVisible ? 'info' : 'grey'"
              text-color="white"
              :label="league.isVisible ? 'VISIBLE' : 'OCULTA'"
              size="sm"
            />
          </div>
        </div>
      </div>
      <div class="hero-actions q-mt-sm">
        <q-btn dense outline color="white" icon="edit" @click="$emit('edit')">
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn dense outline class="q-ml-sm" icon="groups" @click="$emit('view-teams')">
          <q-tooltip>Ver equipos</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStatusColor } from 'src/modules/leagues/presentation/utils/getStatusColor.utils';
import type { League } from 'src/modules/leagues/domain/entities/league.entity';

interface Props {
  league: League;
}

defineProps<Props>();

defineEmits<{
  (e: 'edit'): void;
  (e: 'view-teams'): void;
}>();
</script>
