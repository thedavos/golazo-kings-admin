export class Season {
  constructor(
    public readonly id: number,
    public readonly uuid: string,
    public readonly name: string,
    public readonly startDate: Date | null,
    public readonly endDate: Date | null,
    public readonly isActive: boolean,
    public readonly leagueId: number,
  ) {}

  static fromJson(data: any): Season {
    return new Season(
      data.id,
      data.uuid,
      data.name,
      data.startDate ? new Date(data.startDate) : null,
      data.endDate ? new Date(data.endDate) : null,
      data.isActive,
      data.leagueId,
    );
  }
}
