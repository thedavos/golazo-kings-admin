import type { CreateTeamByScrapingDto } from 'src/modules/scraping/dtos/createTeamByScraping.dto';

export type UpdateTeamByScrapingDto = CreateTeamByScrapingDto & { uuid: string };
