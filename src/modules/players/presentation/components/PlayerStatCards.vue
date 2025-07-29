<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card class="text-center">
        <q-card-section>
          <q-icon name="people" size="2rem" color="primary" />
          <div class="text-h4 q-mt-sm">{{ totalPlayers }}</div>
          <div class="text-grey-6">Total Jugadores</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card class="text-center">
        <q-card-section>
          <q-icon name="sports_soccer" size="2rem" color="positive" />
          <div class="text-h4 q-mt-sm">{{ activePlayers }}</div>
          <div class="text-grey-6">Jugadores Activos</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card class="text-center">
        <q-card-section>
          <q-icon name="pause_circle" size="2rem" color="warning" />
          <div class="text-h4 q-mt-sm">{{ inactivePlayers }}</div>
          <div class="text-grey-6">Jugadores Inactivos</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card class="text-center">
        <q-card-section>
          <q-icon name="star" size="2rem" color="amber" />
          <div class="text-h4 q-mt-sm">{{ wildcardPlayers }}</div>
          <div class="text-grey-6">Jugadores Wildcard</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPlayers: number;
  activePlayers: number;
  inactivePlayers: number;
  wildcardPlayers?: number;
}

withDefaults(defineProps<Props>(), {
  wildcardPlayers: 0
});
</script>

<style lang="scss" scoped>
.q-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}
</style>
