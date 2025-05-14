import { Entity, Column } from 'typeorm';

@Entity('users') // el nombre de la tabla en la base de datos
export class User {
  @Column()
  name: string;

  @Column()
  password: string;
}
