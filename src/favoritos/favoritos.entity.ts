import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  title: string;

  @Column('text', { array: true })
  authors: string[];

  @Column('text')
  description: string;
}
