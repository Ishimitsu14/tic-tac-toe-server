import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class User extends BaseEntity {

    public static readonly statuses = {
        NOT_VERIFIED: 1,
        VERIFIED: 2,
        DELETED: 3,
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ default: () => User.statuses.NOT_VERIFIED })
    status: number

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @Column('timestamp', { default: () => null, nullable: true, onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: string;


}
