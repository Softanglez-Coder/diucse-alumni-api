import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Committee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  officeStartDate: string;

  @Column()
  officeEndDate: string;
}
