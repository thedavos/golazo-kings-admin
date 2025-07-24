import { ApiClient } from 'src/modules/shared/api/client.api';
import { ScrapedTeamMapper } from 'src/modules/scraping/mappers/scrapedTeam.mapper';
import { TeamMapper } from 'src/modules/teams/mappers/team.mapper';
import { ScrapedPlayerMapper } from 'src/modules/scraping/mappers/scrapedPlayer.mapper';
import type { TeamDto } from 'src/modules/teams/dtos/team.dto';
import type { ScrapedTeamDto } from 'src/modules/scraping/dtos/scrapedTeam.dto';
import type { ScrapedTeamRequestDto } from 'src/modules/scraping/dtos/scrapedTeamRequest.dto';
import type { CreateTeamByScrapingDto } from 'src/modules/scraping/dtos/createTeamByScraping.dto';
import type { UpdateTeamByScrapingDto } from 'src/modules/scraping/dtos/updateTeamByScraping.dto';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { ScrapedPlayerRequestDto } from 'src/modules/scraping/dtos/scrapedPlayerRequest.dto';
import type { ScrapedPlayerDto } from 'src/modules/scraping/dtos/scrapedPlayer.dto';
import type { ScrapedPlayer } from 'src/modules/scraping/domain/entities/scrapedPlayer.entity';
import type { CreatePlayerDto } from 'src/modules/players/dtos/create-player.dto';
import type { Player } from 'src/modules/players/domain/entities/player.entity';
import type { ApiResponse } from 'src/modules/shared/api/response.api';
import type { PlayerDto } from 'src/modules/players/dtos/player.dto';
import PlayerMapper from 'src/modules/players/mappers/player.mapper';

export class ScrapingService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getScrapedTeams(scrapedTeamRequestDto: ScrapedTeamRequestDto): Promise<ScrapedTeam[]> {
    const response = await this.apiClient.post<ScrapedTeamDto[]>(
      `/admin/scraping/${scrapedTeamRequestDto.leagueSlug}/teams`,
      {
        leagueId: scrapedTeamRequestDto.leagueId,
      },
    );

    return ScrapedTeamMapper.fromDtos(response.data);
  }

  async createTeamByScraping(createTeamByScrapingDto: CreateTeamByScrapingDto): Promise<Team> {
    const response = await this.apiClient.post<TeamDto>(
      '/admin/scraping/create-team',
      createTeamByScrapingDto,
    );

    return TeamMapper.fromDto(response.data);
  }

  async updateTeamByScraping(updateTeamByScrapingDto: UpdateTeamByScrapingDto): Promise<Team> {
    const response = await this.apiClient.patch<TeamDto>(
      `/admin/scraping/update-team/${updateTeamByScrapingDto.slug}`,
      updateTeamByScrapingDto,
    );

    return TeamMapper.fromDto(response.data);
  }

  async getScrapedPlayers(
    scrapedPlayerRequestDto: ScrapedPlayerRequestDto,
  ): Promise<ScrapedPlayer[]> {
    const response = await this.apiClient.post<ScrapedPlayerDto[]>(
      `/admin/scraping/players`,
      scrapedPlayerRequestDto,
    );

    return ScrapedPlayerMapper.fromDtos(response.data);
  }

  /**
   * Crear un jugador desde datos de scraping
   * Este método maneja el flujo completo de:
   * 1. Creación del jugador desde datos de scraping
   * 2. Descarga de imagen de perfil desde URL externa
   * 3. Subida de imagen a CDN/servicio de almacenamiento
   * 4. Actualización del jugador con la nueva URL de imagen
   *
   * @param playerData - Datos del jugador a crear (debe incluir imageUrl)
   * @returns Promise<Player>
   */
  async createPlayerByScraping(playerData: CreatePlayerDto): Promise<Player> {
    const response: ApiResponse<PlayerDto> = await this.apiClient.post(
      '/admin/scraping/create-player',
      playerData,
    );
    return PlayerMapper.fromDto(response.data);
  }
}
