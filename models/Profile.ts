import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';
import { config } from 'dotenv';

config();
@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({ nullable: true })
      avatar?: string;

    @Column()
      displayName: string;

    @Column({ nullable: true })
      firstName?: string;

    @Column({ nullable: true })
      lastName?: string;

    @Column('timestamp', { nullable: true })
      birthDay?: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
      createdAt: string;

    @Column('timestamp', { default: null, nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
      updatedAt?: string;
}
