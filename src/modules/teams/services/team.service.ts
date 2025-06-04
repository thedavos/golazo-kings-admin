import { ApiClient } from 'src/modules/shared/api/client.api';
import { TeamMapper } from 'src/modules/teams/mappers/team.mapper';
import type { ApiResponse } from 'src/modules/shared/api/response.api';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';
import type { TeamDto } from 'src/modules/teams/dtos/team.dto';
import type { CreateTeamDto } from 'src/modules/teams/dtos/create-team.dto';
import type { UpdateTeamDto } from 'src/modules/teams/dtos/update-team.dto';

export class TeamService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getTeams(): Promise<Team[]> {
    const response: ApiResponse<TeamDto[]> = await this.apiClient.get('/teams');
    return TeamMapper.fromDtos(response.data);
  }

  async getTeamById(id: number): Promise<Team> {
    const response: ApiResponse<TeamDto> = await this.apiClient.get(`/teams/${id}`);
    return TeamMapper.fromDto(response.data);
  }

  async getTeamByUuid(uuid: string): Promise<Team> {
    const response: ApiResponse<TeamDto> = await this.apiClient.get(`/teams/${uuid}`);
    return TeamMapper.fromDto(response.data);
  }

  async createTeam(team: CreateTeamDto): Promise<Team> {
    const response: ApiResponse<TeamDto> = await this.apiClient.post('/teams', team);
    return TeamMapper.fromDto(response.data);
  }

  async updateTeam(id: number, teamData: UpdateTeamDto): Promise<Team> {
    const response: ApiResponse<TeamDto> = await this.apiClient.put(`/teams/${id}`, teamData);
    return TeamMapper.fromDto(response.data);
  }

  async patchTeam(id: number, teamData: UpdateTeamDto): Promise<Team> {
    const response: ApiResponse<TeamDto> = await this.apiClient.patch(`/teams/${id}`, teamData);
    return TeamMapper.fromDto(response.data);
  }

  async deleteTeam(id: number): Promise<void> {
    await this.apiClient.delete(`/teams/${id}`);
  }
}
