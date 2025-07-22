import { ValidationUtils } from 'src/modules/shared/utils/validation.util';
import type { ScrapedPlayerDto } from 'src/modules/scraping/dtos/scrapedPlayer.dto';

export class ScrapedPlayer {
  public readonly name: string | undefined;
  public readonly firstName: string | undefined;
  public readonly lastName: string | undefined;
  public readonly position: string | undefined;
  public readonly jerseyNumber: number | undefined;
  public readonly isWildCard: boolean | undefined;
  public readonly imageUrl: string | undefined;
  public readonly referenceId: number | null;
  public readonly referenceUrl: string | null;

  public slug: string;

  constructor(data: Partial<ScrapedPlayerDto>) {
    this.name = data.name;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.position = data.position;
    this.jerseyNumber = data.jerseyNumber;
    this.isWildCard = data.isWildCard;
    this.imageUrl = data.imageUrl;
    this.referenceId = data.referenceId || null;
    this.referenceUrl = data.referenceUrl || null;

    this.slug = this.generateSlugFromName();
  }

  public generateSlugFromName(): string {
    return ValidationUtils.generateSlug(this.name || `${this.firstName} ${this.lastName}`);
  }

  public isSlugValid(): boolean {
    const generatedSlug = this.generateSlugFromName();
    return this.slug === generatedSlug;
  }

  public getDisplayInfo(): string {
    return `${this.name} (${this.slug}) - Position: ${this.position} - Jersey: ${this.jerseyNumber} - Wildcard: ${this.isWildCard}`;
  }
}
