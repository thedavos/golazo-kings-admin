import type { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';

export interface ScrapingResult {
  success: boolean;
  type: ScrapingType;
  itemsScraped: number;
  itemsCreated: number;
  itemsUpdated: number;
  errors: string[];
  scrapedItems?: any[];
  timestamp: Date;
  duration: number;
  details?: {
    leagueName?: string;
    teamName?: string;
    [key: string]: any;
  };
}

export interface TeamScrapingResult extends ScrapingResult {
  type: ScrapingType.TEAMS;
  scrapedItems: ScrapedTeam[];
}

export type TeamScrapingProcessResult = Omit<
  TeamScrapingResult,
  'type' | 'timestamp' | 'duration' | 'details'
>;
