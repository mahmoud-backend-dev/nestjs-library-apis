import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  verifiedEmail: boolean;

  @Column({ nullable: true })
  expiredConfirmEmail: Date;

  @Column({ type: 'boolean', default: false })
  verifiedPassword: boolean;

  @Column({ nullable: true })
  image: string;
};



