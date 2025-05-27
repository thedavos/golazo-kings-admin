<template>
  <div>
    <q-card flat class="col-md-2 col-sm-2 col-xs-12">
      <q-card-section>
        <div class="text-h6">{{ totalLeagues }}</div>
        <div class="text-grey-6">Total de Ligas</div>
      </q-card-section>
    </q-card>

    <q-card flat class="col-md-2 col-sm-2 col-xs-12">
      <q-card-section>
        <div class="text-h6">{{ activeLeagues }}</div>
        <div class="text-grey-6">Ligas Activas</div>
      </q-card-section>
    </q-card>

    <q-card flat class="col-md-2 col-sm-2 col-xs-12">
      <q-card-section>
        <div class="text-h6">{{ visibleLeagues }}</div>
        <div class="text-grey-6">Ligas Visibles</div>
      </q-card-section>
    </q-card>

    <q-card flat class="col-md-2 col-sm-2 col-xs-12">
      <q-card-section>
        <div class="text-h6">{{ countries }}</div>
        <div class="text-grey-6">Países</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
defineProps({
  totalLeagues: {
    type: Number,
    default: 0,
  },

  activeLeagues: {
    type: Number,
    default: 0,
  },

  visibleLeagues: {
    type: Number,
    default: 0,
  },

  countries: {
    type: Number,
    default: 0,
  },
});
</script>
