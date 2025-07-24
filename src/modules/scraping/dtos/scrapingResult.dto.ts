import type { ScrapingType } from 'src/modules/scraping/domain/enums/scrapingType.enum';
import type { ScrapedTeam } from 'src/modules/scraping/domain/entities/scrapedTeam.entity';
import type { ScrapedPlayer } from 'src/modules/scraping/domain/entities/scrapedPlayer.entity';

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

export interface PlayerScrapingResult extends ScrapingResult {
  type: ScrapingType.PLAYERS;
  scrapedItems: ScrapedPlayer[];
}

export type PlayerScrapingProcessResult = Omit<
  PlayerScrapingResult,
  'type' | 'timestamp' | 'duration' | 'details'
>;

export interface TeamScrapingResult extends ScrapingResult {
  type: ScrapingType.TEAMS;
  scrapedItems: ScrapedTeam[];
}

export type TeamScrapingProcessResult = Omit<
  TeamScrapingResult,
  'type' | 'timestamp' | 'duration' | 'details'
>;
