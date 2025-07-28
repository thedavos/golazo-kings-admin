<template>
  <div class="team-hero-section">
    <div class="hero-background">
      <div class="hero-content">
        <q-avatar size="80px" class="hero-logo">
          <img v-if="team.logoUrl" :src="team.logoUrl" alt="Logo del Equipo" />
          <q-icon v-else name="sports_soccer" />
        </q-avatar>
        <div class="hero-info">
          <h1 class="team-name">{{ team.name }}</h1>
          <p class="team-location">
            <q-icon name="place" />
            {{ team.fullLocation }}
          </p>
          <q-chip
            :color="team.isQueensLeagueTeam ? 'pink' : 'primary'"
            text-color="white"
            :label="team.isQueensLeagueTeam ? 'Queens League' : 'Kings League'"
          />
        </div>
        <div class="hero-actions">
          <q-btn outline color="white" icon="edit" label="Editar" @click="$emit('edit')" />
          <q-btn
            color="primary"
            icon="people"
            label="Ver Jugadores"
            @click="$emit('view-players')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

interface Props {
  team: Team;
}

defineProps<Props>();
defineEmits<{
  (e: 'edit'): void;
  (e: 'view-players'): void;
}>();
</script>

<style lang="scss" scoped>
.team-hero-section {
  width: 100%;

  .hero-background {
    background-color: var(--q-primary);
    background-image: linear-gradient(135deg, var(--q-primary) 0%, var(--q-dark) 100%);
    color: white;
    padding: 2rem;

    .hero-content {
      display: flex;
      align-items: center;

      .hero-logo {
        margin-right: 1.5rem;
        background: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      .hero-info {
        flex: 1;

        .team-name {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
        }

        .team-location {
          display: flex;
          align-items: center;
          margin: 0 0 0.5rem 0;

          .q-icon {
            margin-right: 0.5rem;
          }
        }
      }

      .hero-actions {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
}

@media (max-width: 600px) {
  .team-hero-section {
    .hero-background {
      padding: 1rem;

      .hero-content {
        flex-direction: column;
        text-align: center;

        .hero-logo {
          margin-right: 0;
          margin-bottom: 1rem;
        }

        .hero-info {
          margin-bottom: 1rem;

          .team-location {
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
