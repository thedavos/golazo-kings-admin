import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PlayerService } from 'src/modules/players/services/player.service';
import { useQuery, useMutation, useQueryCache } from '@pinia/colada';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';
import type { UpdatePlayerDto } from 'src/modules/players/dtos/update-player.dto';

const CACHE_KEYS = {
  PLAYERS: ['players'] as const,
  PLAYERS_BY_TEAM: (teamId: number) => ['players', 'team', teamId] as const,
  PLAYER_DETAIL: (id: number) => ['players', id] as const,
};

export const usePlayerDetailsStore = defineStore('playerDetails', () => {
  const notifications = useQuasarNotifications();
  const queryCache = useQueryCache();

  const playerService = new PlayerService();

  // Filters
  const filters = ref({
    search: '',
    teamId: null as number | null,
    position: '',
    nationality: '',
    isActive: null as boolean | null,
  });

  // Cache invalidation
  const invalidatePlayerCache = async (playerId?: number) => {
    const promises = [];

    promises.push(queryCache.invalidateQueries({ key: CACHE_KEYS.PLAYERS }));

    if (filters.value.teamId) {
      promises.push(
        queryCache.invalidateQueries({
          key: CACHE_KEYS.PLAYERS_BY_TEAM(filters.value.teamId),
        }),
      );
    }

    if (playerId) {
      promises.push(
        queryCache.invalidateQueries({
          key: CACHE_KEYS.PLAYER_DETAIL(playerId),
          exact: true,
        }),
      );
    }

    await Promise.all(promises);
  };

  // Queries
  const playersQuery = useQuery({
    key: computed(() => {
      if (filters.value.teamId) {
        return CACHE_KEYS.PLAYERS_BY_TEAM(filters.value.teamId);
      }
      return CACHE_KEYS.PLAYERS;
    }),
    query: () => playerService.getPlayers(filters.value.teamId || undefined),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutations
  const createPlayerMutation = useMutation({
    mutation: (createData: CreatePlayerDto) => playerService.createPlayer(createData),
    async onSuccess(newPlayer) {
      notifications.notifySuccess('Jugador creado exitosamente');
      await invalidatePlayerCache(newPlayer.id);
    },
    onError(error) {
      notifications.notifyError(`Error al crear el jugador: ${error.message}`);
      throw error;
    },
  });

  const updatePlayerMutation = useMutation({
    mutation: ({ id, uuid, data }: { id: number; uuid: string; data: UpdatePlayerDto }) =>
      playerService.updatePlayer(id, uuid, data),
    async onSuccess(updatedPlayer) {
      notifications.notifySuccess('Jugador actualizado exitosamente');
      await invalidatePlayerCache(updatedPlayer.id);
    },
    onError(error) {
      notifications.notifyError(`Error al actualizar el jugador: ${error.message}`);
      throw error;
    },
  });

  const deletePlayerMutation = useMutation({
    mutation: (id: number) => playerService.deletePlayer(id),
    async onSuccess() {
      notifications.notifySuccess('Jugador eliminado exitosamente');
      await invalidatePlayerCache();
    },
    onError(error) {
      notifications.notifyError(`Error al eliminar el jugador: ${error.message}`);
      throw error;
    },
  });

  // Computed
  const filteredPlayers = computed(() => {
    if (!playersQuery.data.value) return [];

    return playersQuery.data.value.filter((player) => {
      const matchesSearch =
        !filters.value.search ||
        player.fullName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        (player.nickname &&
          player.nickname.toLowerCase().includes(filters.value.search.toLowerCase()));

      const matchesPosition =
        !filters.value.position || (player.position as string) === filters.value.position;

      const matchesNationality =
        !filters.value.nationality || player.nationality === filters.value.nationality;

      const matchesActive =
        filters.value.isActive === null || player.isActive === filters.value.isActive;

      return matchesSearch && matchesPosition && matchesNationality && matchesActive;
    });
  });

  const totalPlayers = computed(() => playersQuery.data.value?.length || 0);
  const activePlayers = computed(
    () => playersQuery.data.value?.filter((p) => p.isActive).length || 0,
  );
  const inactivePlayers = computed(
    () => playersQuery.data.value?.filter((p) => !p.isActive).length || 0,
  );

  // Loading states
  const loadings = computed(() => ({
    list: playersQuery.isLoading.value,
    create: createPlayerMutation.isLoading.value,
    update: updatePlayerMutation.isLoading.value,
    delete: deletePlayerMutation.isLoading.value,
  }));

  // Actions
  const createPlayer = async (playerData: CreatePlayerDto): Promise<Player> => {
    return await createPlayerMutation.mutateAsync(playerData);
  };

  const updatePlayer = async (
    id: number,
    uuid: string,
    playerData: UpdatePlayerDto,
  ): Promise<Player> => {
    return await updatePlayerMutation.mutateAsync({ id, uuid, data: playerData });
  };

  const deletePlayer = async (id: number): Promise<void> => {
    await deletePlayerMutation.mutateAsync(id);
  };

  const clearFilters = () => {
    filters.value = {
      search: '',
      teamId: null,
      position: '',
      nationality: '',
      isActive: null,
    };
  };

  return {
    // State
    filters,
    players: filteredPlayers,

    // Queries
    playersQuery,

    // Computed
    totalPlayers,
    activePlayers,
    inactivePlayers,
    loadings,

    // Actions
    createPlayer,
    updatePlayer,
    deletePlayer,
    clearFilters,
    invalidatePlayerCache,
  };
});
