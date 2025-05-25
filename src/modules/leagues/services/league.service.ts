import { ApiClient } from 'src/modules/shared/api/client.api';
import type { ApiResponse } from 'src/modules/shared/api/response.api';
import { League } from 'src/modules/leagues/domain/entities/league.entity';
import type { LeagueDto } from 'src/modules/leagues/dtos/league.dto';
import type { CreateLeagueDto } from 'src/modules/leagues/dtos/create-league.dto';
import type { UpdateLeagueDto } from 'src/modules/leagues/dtos/update-league.dto';

export class LeagueService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getLeagues(): Promise<League[]> {
    const response: ApiResponse<LeagueDto[]> = await this.apiClient.get('/leagues');
    return response.data.map((dto) => League.fromJson(dto));
  }

  async getLeagueById(id: number): Promise<League> {
    const response: ApiResponse<LeagueDto> = await this.apiClient.get(`/leagues/${id}`);
    return League.fromJson(response.data);
  }

  async getLeagueByUuid(uuid: string): Promise<League> {
    const response: ApiResponse<LeagueDto> = await this.apiClient.get(`/leagues/uuid/${uuid}`);
    return League.fromJson(response.data);
  }

  async createLeague(leagueData: CreateLeagueDto): Promise<League> {
    const response: ApiResponse<LeagueDto> = await this.apiClient.post('/leagues', leagueData);
    return League.fromJson(response.data);
  }

  async updateLeague(id: number, leagueData: UpdateLeagueDto): Promise<League> {
    const response: ApiResponse<LeagueDto> = await this.apiClient.put(`/leagues/${id}`, leagueData);
    return League.fromJson(response.data);
  }

  async patchLeague(id: number, leagueData: UpdateLeagueDto): Promise<League> {
    const response: ApiResponse<LeagueDto> = await this.apiClient.patch(
      `/leagues/${id}`,
      leagueData,
    );
    return League.fromJson(response.data);
  }

  async deleteLeague(id: number): Promise<void> {
    await this.apiClient.delete(`/leagues/${id}`);
  }

  async getActiveLeagues(): Promise<League[]> {
    const leagues = await this.getLeagues();
    return leagues.filter((league) => league.isActive);
  }

  async getLeaguesByCountry(country: string): Promise<League[]> {
    const leagues = await this.getLeagues();
    return leagues.filter((league) => league.country.toLowerCase() === country.toLowerCase());
  }

  async toggleLeagueStatus(id: number): Promise<League> {
    const league = await this.getLeagueById(id);
    return await this.patchLeague(id, { isActive: !league.isActive });
  }

  async toggleLeagueVisibility(id: number): Promise<League> {
    const league = await this.getLeagueById(id);
    return await this.patchLeague(id, { isVisible: !league.isVisible });
  }
}
