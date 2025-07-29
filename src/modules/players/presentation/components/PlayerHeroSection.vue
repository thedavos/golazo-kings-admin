<template>
  <div class="player-hero-section">
    <div class="hero-background bg-primary">
      <div class="hero-content">
        <q-avatar size="100px" color="white" class="flex items-center justify-center">
          <q-img
            v-if="player.profileImageUrl"
            fit="cover"
            :src="player.profileImageUrl"
            @error="onImageError"
          />
          <q-icon v-else name="person" />
        </q-avatar>
        <div class="hero-info">
          <h1 class="player-name">{{ player.fullName }}</h1>
          <p v-if="player.nickname" class="player-nickname">"{{ player.nickname }}"</p>
          <div class="player-details">
            <q-chip color="white" outline :label="player.position || 'Sin posición'" />
            <q-chip
              v-if="player.jerseyNumber"
              outline
              color="white"
              :label="`#${player.jerseyNumber}`"
            />
            <q-chip
              :color="player.isActive ? 'positive' : 'negative'"
              text-color="white"
              :label="player.isActive ? 'Activo' : 'Inactivo'"
            />
            <q-chip
              v-if="player.isWildCard"
              color="amber"
              text-color="white"
              :label="getWildcardTypeLabel(player.wildCardType)"
            />
          </div>
        </div>
        <div class="hero-actions">
          <q-btn outline color="white" icon="edit" label="Editar" @click="$emit('edit')" />
          <q-btn color="primary" icon="groups" label="Ver Equipo" @click="$emit('view-team')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import type { Player } from 'src/modules/players/domain/entities/player.entity';

interface Props {
  player: Player;
}

interface Emits {
  (e: 'edit'): void;
  (e: 'view-team'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const notifications = useQuasarNotifications();

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '';
  notifications.notifyWarning('Error al cargar la imagen del jugador');
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
.player-hero-section {
  .hero-background {
    padding: 2rem;

    .hero-content {
      display: flex;
      align-items: center;
      gap: 2rem;
      color: white;

      .hero-info {
        flex: 1;

        .player-name {
          margin: 0;
          font-size: 2.5rem;
          font-weight: bold;
        }

        .player-nickname {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          opacity: 0.8;
        }

        .player-details {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-direction: column;
      }
    }
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;

    .hero-actions {
      flex-direction: row !important;
      margin-top: 1rem;
    }
  }
}
</style>
