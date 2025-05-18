import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  title: string;

  @Column('text', { array: true, nullable: true })
  authors: string[];

  @Column({ nullable: true })
  thumbnail: string;

  @Column('text', { nullable: true })
  description: string;
}
