import { ValidationUtils } from 'src/modules/shared/utils/validation.util';

export class ScrapedTeam {
  public readonly name: string;
  public readonly logoUrl: string;
  public readonly slug: string;
  public readonly leagueId: number;
  public readonly scrapedAt: Date;
  public readonly source: string;

  constructor(data: {
    name: string;
    logoUrl: string;
    slug: string;
    leagueId: number;
    scrapedAt?: Date;
    source?: string;
  }) {
    this.name = data.name;
    this.logoUrl = data.logoUrl;
    this.slug = data.slug;
    this.leagueId = data.leagueId;
    this.scrapedAt = data.scrapedAt || new Date();
    this.source = data.source || 'kingsleague.pro';
  }

  public isValid(): boolean {
    return !!(this.name && this.slug && this.leagueId);
  }

  public hasLogo(): boolean {
    return !!this.logoUrl && this.logoUrl.startsWith('http');
  }

  public isRecent(hoursThreshold: number = 24): boolean {
    const hoursDiff = (Date.now() - this.scrapedAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= hoursThreshold;
  }

  public generateSlugFromName(): string {
    return ValidationUtils.generateSlug(this.name);
  }

  public isSlugValid(): boolean {
    const generatedSlug = this.generateSlugFromName();
    return this.slug === generatedSlug;
  }

  public getDisplayInfo(): string {
    return `${this.name} (${this.slug}) - League: ${this.leagueId}`;
  }
}
