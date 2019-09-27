import { Column, Entity, ObjectIdColumn } from 'typeorm';

export class UserBase {
  @Column({
    unique: true,
  })
  email: string;
}

export class UserDto extends UserBase {
  @Column()
  password: string;
}

@Entity()
export class User extends UserDto {
  @ObjectIdColumn()
  id: string;

  static create = (dto: UserDto): User => {
    const user = new User();

    Object.entries(dto).forEach(([key, value]) => {
      user[key] = value;
    });

    return user;
  };
}

export class UserSerialized extends UserBase {
  id: string;
}
