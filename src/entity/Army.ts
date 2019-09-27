import { Column, Entity, ObjectIdColumn } from 'typeorm';

export class ArmyDto {
  @Column()
  name: string;

  @Column()
  squadCount: number;
}

@Entity()
export class Army extends ArmyDto {
  @ObjectIdColumn()
  id: string;

  static create = (dto: ArmyDto): Army => {
    const army = new Army();

    Object.entries(dto).forEach(([key, value]) => {
      army[key] = value;
    });

    return army;
  };
}

export const ArmySerialized = ArmyDto;