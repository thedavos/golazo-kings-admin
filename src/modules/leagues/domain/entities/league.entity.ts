import { Season } from './season.entity';
import { LeagueStatus } from 'src/modules/leagues/domain/enums/league-status.enum';

export class League {
  constructor(
    public readonly id: number,
    public readonly uuid: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly abbr: string,
    public readonly country: string,
    public readonly city: string,
    public readonly logoUrl: string | null,
    public readonly foundationYear: number | null,
    public readonly website: string | null,
    public readonly twitterHandle: string | null,
    public readonly instagramHandle: string | null,
    public readonly numberOfTeams: number,
    public readonly description: string,
    public readonly rules: string | null,
    public readonly status: LeagueStatus,
    public readonly isActive: boolean,
    public readonly isVisible: boolean,
    public readonly seasons: Season[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromJson(data: any): League {
    return new League(
      data.id,
      data.uuid,
      data.name,
      data.slug,
      data.abbr,
      data.country,
      data.city,
      data.logoUrl,
      data.foundationYear,
      data.website,
      data.twitterHandle,
      data.instagramHandle,
      data.numberOfTeams,
      data.description,
      data.rules,
      data.status as LeagueStatus,
      data.isActive,
      data.isVisible,
      data.seasons?.map((season: any) => Season.fromJson(season)) || [],
      new Date(data.createdAt),
      new Date(data.updatedAt),
    );
  }

  get isInDraft(): boolean {
    return this.status === LeagueStatus.DRAFT;
  }

  get isOperational(): boolean {
    return this.isActive && this.isVisible;
  }

  get displayName(): string {
    return `${this.name} (${this.abbr})`;
  }

  get location(): string {
    return `${this.city}, ${this.country}`;
  }

  get hasLogo(): boolean {
    return this.logoUrl !== null;
  }

  get hasSocialMedia(): boolean {
    return !!this.twitterHandle || !!this.instagramHandle;
  }

  get hasWebsite(): boolean {
    return !!this.website;
  }

  public getAge(): number | null {
    if (!this.foundationYear) return null;
    return new Date().getFullYear() - this.foundationYear;
  }

  hasActiveSeason(): boolean {
    return this.seasons.some((season) => season.isActive);
  }
}
