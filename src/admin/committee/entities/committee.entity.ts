import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Committee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  position: string;

  @Column()
  session: string;

  @Column('bigint')
  contactNumber: number;

  @Column()
  email: string;

  @Column()
  currentProfession: string;
}
