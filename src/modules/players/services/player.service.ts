import { ApiClient } from 'src/modules/shared/api/client.api';
import PlayerMapper from 'src/modules/players/mappers/player.mapper';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import type { PlayerDto } from 'src/modules/players/dtos/player.dto';
import type { ApiResponse } from 'src/modules/shared/api/response.api';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';
import type { UpdatePlayerDto } from 'src/modules/players/dtos/update-player.dto';

export class PlayerService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Obtener todos los jugadores, opcionalmente filtrados por equipo
   * @param teamId - ID del equipo para filtrar (opcional)
   * @returns Promise<Player[]>
   */
  async getPlayers(teamId?: number): Promise<Player[]> {
    const queryParams = teamId ? `?teamId=${teamId}` : '';
    const response: ApiResponse<PlayerDto[]> = await this.apiClient.get(`/players${queryParams}`);
    return PlayerMapper.fromDtos(response.data);
  }

  /**
   * Obtener un jugador por su ID
   * @param id - ID del jugador
   * @returns Promise<Player>
   */
  async getPlayerById(id: number): Promise<Player> {
    const response: ApiResponse<PlayerDto> = await this.apiClient.get(`/players/${id}`);
    return PlayerMapper.fromDto(response.data);
  }

  /**
   * Obtener un jugador por su slug
   * @param slug - Slug del jugador
   * @returns Promise<Player>
   */
  async getPlayerBySlug(slug: string): Promise<Player> {
    const response: ApiResponse<PlayerDto> = await this.apiClient.get(`/players/slug/${slug}`);
    return PlayerMapper.fromDto(response.data);
  }

  /**
   * Crear un nuevo jugador
   * @param playerData - Datos del jugador a crear
   * @returns Promise<Player>
   */
  async createPlayer(playerData: CreatePlayerDto): Promise<Player> {
    const response: ApiResponse<PlayerDto> = await this.apiClient.post('/players', playerData);
    return PlayerMapper.fromDto(response.data);
  }

  /**
   * Actualizar un jugador existente
   * @param id - ID del jugador a actualizar
   * @param uuid - UUID del jugador a actualizar
   * @param playerData - Datos actualizados del jugador
   * @returns Promise<Player>
   */
  async updatePlayer(id: number, uuid: string, playerData: UpdatePlayerDto): Promise<Player> {
    const response: ApiResponse<PlayerDto> = await this.apiClient.patch(`/players/${id}`, {
      ...playerData,
      uuid,
    });

    return PlayerMapper.fromDto(response.data);
  }

  /**
   * Eliminar un jugador
   * @param id - ID del jugador a eliminar
   * @returns Promise<void>
   */
  async deletePlayer(id: number): Promise<void> {
    await this.apiClient.delete(`/players/${id}`);
  }

  /**
   * Subir una imagen para un jugador específico
   * @param playerId - ID del jugador
   * @param file - Archivo de imagen
   * @returns Promise<any> (Image entity from backend)
   */
  async uploadPlayerImage(playerId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.apiClient.post(`/players/${playerId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Eliminar una imagen específica de un jugador
   * @param playerId - ID del jugador
   * @param imageId - ID de la imagen a eliminar
   * @returns Promise<void>
   */
  async deletePlayerImage(playerId: number, imageId: number): Promise<void> {
    await this.apiClient.delete(`/players/${playerId}/images/${imageId}`);
  }

  /**
   * Obtener jugadores por equipo (método de conveniencia)
   * @param teamId - ID del equipo
   * @returns Promise<Player[]>
   */
  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return this.getPlayers(teamId);
  }

  /**
   * Obtener jugadores activos
   * @returns Promise<Player[]>
   */
  async getActivePlayers(): Promise<Player[]> {
    const allPlayers = await this.getPlayers();
    return allPlayers.filter((player) => player.isActive);
  }
}
