import { ApiClient } from 'src/modules/shared/api/client.api';
import { ScrapedTeamMapper } from 'src/modules/scraping/mappers/scrapedTeam.mapper';
import { TeamMapper } from 'src/modules/teams/mappers/team.mapper';
import type { TeamDto } from 'src/modules/teams/dtos/team.dto';
import type { ScrapedTeamDto } from 'src/modules/scraping/dtos/scrapedTeam.dto';
import type { ScrapedTeamRequestDto } from 'src/modules/scraping/dtos/scrapedTeamRequest.dto';
import type { CreateTeamByScrapingDto } from 'src/modules/scraping/dtos/createTeamByScraping.dto';
import type { UpdateTeamByScrapingDto } from 'src/modules/scraping/dtos/updateTeamByScraping.dto';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type { Team } from 'src/modules/teams/domain/entities/team.entity';

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
}
