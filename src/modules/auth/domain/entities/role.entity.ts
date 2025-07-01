import type { Permission } from 'src/modules/auth/domain/enums/permission.enum';

export class Role {
  public readonly id: number;
  public readonly name: string;
  public readonly permissions: Permission[];
  public readonly description: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: number,
    name: string,
    permissions: Permission[],
    description: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
    this.description = description;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  fromJson(data: any): Role {
    return new Role(
      data.id,
      data.name,
      data.permissions,
      data.description,
      data.createdAt,
      data.updatedAt,
    );
  }
}
