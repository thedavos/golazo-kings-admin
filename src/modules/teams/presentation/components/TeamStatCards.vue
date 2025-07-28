<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card flat class="text-center">
        <q-card-section>
          <q-icon name="groups" size="2rem" color="primary" />
          <div class="text-h4 q-mt-sm">{{ totalTeams }}</div>
          <div class="text-grey-6">Total Equipos</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card flat class="text-center">
        <q-card-section>
          <q-icon name="sports_soccer" size="2rem" color="positive" />
          <div class="text-h4 q-mt-sm">{{ activeTeams }}</div>
          <div class="text-grey-6">Equipos Activos</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card flat class="text-center">
        <q-card-section>
          <q-icon name="female" size="2rem" color="pink" />
          <div class="text-h4 q-mt-sm">{{ queensTeams }}</div>
          <div class="text-grey-6">Equipos Queens</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-3 col-sm-6 col-xs-12">
      <q-card flat class="text-center">
        <q-card-section>
          <q-icon name="emoji_events" size="2rem" color="warning" />
          <div class="text-h4 q-mt-sm">{{ leagues }}</div>
          <div class="text-grey-6">Ligas</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalTeams: number;
  activeTeams: number;
  queensTeams: number;
  leagues: number;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.q-card {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}
</style>
