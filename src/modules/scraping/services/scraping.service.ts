import { ApiClient } from 'src/modules/shared/api/client.api';
import { ScrapedTeamMapper } from 'src/modules/scraping/mappers/scrapedTeam.mapper';
import type { ScrapedTeamDto } from 'src/modules/scraping/dtos/scrapedTeam.dto';
import type { ScrapedTeamRequestDto } from 'src/modules/scraping/dtos/scrapedTeamRequest.dto';

export class ScrapingService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async getScrapedTeams(scrapedTeamRequestDto: ScrapedTeamRequestDto) {
    const response = await this.apiClient.post<ScrapedTeamDto[]>(
      `/admin/scraping/${scrapedTeamRequestDto.leagueSlug}/teams`,
      {
        leagueId: scrapedTeamRequestDto.leagueId,
      },
    );

    return ScrapedTeamMapper.fromDtos(response.data);
  }
}
