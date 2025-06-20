import { defineStore } from 'pinia';
import { computed, readonly, ref } from 'vue';
import { useQuery, useMutation, useQueryCache } from '@pinia/colada';
import { TeamService } from 'src/modules/teams/services/team.service';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { useCacheConfig } from 'src/modules/shared/composables/useCacheConfig.composable';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { UpdateTeamDto } from 'src/modules/teams/dtos/update-team.dto';
import type { CreateTeamDto } from 'src/modules/teams/dtos/create-team.dto';

const CACHE_KEYS = {
  TEAMS: ['teams'] as const,
  TEAM_DETAIL: (id: number) => ['teams', id] as const,
} as const;

export const useTeamDetailsStore = defineStore('teamDetails', () => {
  // Composables
  const notifications = useQuasarNotifications();
  const queryCache = useQueryCache();
  const { themes } = useCacheConfig();

  // Servicio
  const teamService = new TeamService();

  // Estado
  const selectedTeam = ref<Team | null>(null);
  const selectedTeamId = computed(() => selectedTeam.value?.id);

  const invalidateTeamCaches = async (teamId?: number) => {
    const promises = [];

    promises.push(queryCache.invalidateQueries({ key: CACHE_KEYS.TEAMS }));

    if (teamId) {
      promises.push(
        queryCache.invalidateQueries({
          key: CACHE_KEYS.TEAM_DETAIL(teamId),
          exact: true,
        }),
      );
    }

    await Promise.all(promises);
  };

  const selectedTeamQuery = useQuery({
    key: () => CACHE_KEYS.TEAM_DETAIL(selectedTeamId.value!),
    query: (): Promise<Team> => {
      if (!selectedTeamId.value) {
        throw new Error('No team ID selected');
      }

      return teamService.getTeamById(selectedTeamId.value);
    },
    enabled: () => selectedTeamId.value !== null,
    ...themes.teams.detail,
  });

  // Computed
  const hasSelectedTeam = computed(() => !!selectedTeam.value);

  const createMutation = useMutation({
    mutation: (teamData: CreateTeamDto) => teamService.createTeam(teamData),
    async onSuccess(newTeam) {
      notifications.notifySuccess('Equipo creado exitosamente');
      await invalidateTeamCaches(newTeam.id);
    },
    onError(error) {
      notifications.notifyError(`Error al crear el equipo: ${error.message}`);
      throw error;
    },
  });

  const updateMutation = useMutation({
    mutation: ({ id, teamData }: { id: number; teamData: UpdateTeamDto }) =>
      teamService.updateTeam(id, teamData),
    async onSuccess(updatedTeam) {
      notifications.notifySuccess('Equipo actualizado exitosamente');
      await invalidateTeamCaches(updatedTeam.id);
    },
    onError(error) {
      notifications.notifyError(`Error al actualizar el equipo: ${error.message}`);
      throw error;
    },
  });

  const deleteMutation = useMutation({
    mutation: (id: number) => teamService.deleteTeam(id),
    async onSuccess(_, deletedId) {
      notifications.notifySuccess('Equipo eliminado exitosamente');

      if (selectedTeamId.value === deletedId) {
        selectedTeam.value = null;
      }

      await invalidateTeamCaches();
    },
    onError(error) {
      notifications.notifyError(`Error al eliminar el equipo: ${error.message}`);
    },
  });

  const fetchTeam = async () => {
    clearSelection();
    await selectedTeamQuery.refresh();

    if (selectedTeamQuery.data.value) {
      selectedTeam.value = selectedTeamQuery.data.value;
    }

    return selectedTeam.value;
  };

  const selectTeam = (team: Team) => {
    selectedTeam.value = team;
  };

  const createTeam = async (teamData: CreateTeamDto, autoSelect = true) => {
    const newTeam = await createMutation.mutateAsync(teamData);

    if (autoSelect) {
      selectedTeam.value = newTeam;
    }

    return newTeam;
  };

  const updateTeam = async (teamData: UpdateTeamDto) => {
    if (!selectedTeamId.value) {
      throw new Error('No hay equipo seleccionado para actualizar');
    }

    return updateMutation.mutateAsync({
      id: selectedTeamId.value,
      teamData,
    });
  };

  const deleteTeam = async () => {
    if (!selectedTeamId.value) {
      throw new Error('No hay equipo seleccionado para eliminar');
    }

    return deleteMutation.mutateAsync(selectedTeamId.value);
  };

  const clearSelection = () => {
    selectedTeam.value = null;
  };

  const isLoading = computed(
    () =>
      createMutation.isLoading.value ||
      updateMutation.isLoading.value ||
      deleteMutation.isLoading.value,
  );

  const isLoadingAny = computed(() => selectedTeamQuery.isLoading.value || isLoading.value);

  return {
    team: selectedTeamQuery.data,
    teamLoading: selectedTeamQuery.isLoading,
    teamError: selectedTeamQuery.error,

    selectedTeam: readonly(selectedTeam),
    selectedTeamId: readonly(selectedTeamId),
    hasSelectedTeam,

    fetchTeam,
    selectTeam,
    clearSelection,

    createTeam,
    updateTeam,
    deleteTeam,

    loadingCreate: createMutation.isLoading,
    loadingUpdate: updateMutation.isLoading,
    loadingDelete: deleteMutation.isLoading,
    isLoading,
    isLoadingAny,

    errorCreate: createMutation.error,
    errorUpdate: updateMutation.error,
    errorDelete: deleteMutation.error,
  };
});
