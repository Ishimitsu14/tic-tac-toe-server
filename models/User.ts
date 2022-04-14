import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { config } from 'dotenv';

import {Profile} from "./Profile";

import {generateRandomSting} from "@utils/string";

import {MailerService} from "@services/MailerService";

import ConfirmationEmail from "@mails/confirmation-email/confirmationEmail";
import RecoveryPassword from "@mails/recovery-password/recoveryPassword";


config()
@Entity()
export class User extends BaseEntity {

    public static readonly statuses = {
        NOT_VERIFIED: 1,
        VERIFIED: 2,
        DELETED: 3,
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    verifiedHash?: string;

    @Column({ nullable: true })
    recoveryPasswordHash?: string;

    @Column({ default: User.statuses.NOT_VERIFIED })
    status: number

    @Column('timestamp', { default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @Column('timestamp', { default: null, nullable: true, onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt?: string;

    @OneToOne(() => Profile, { cascade: true })
    @JoinColumn()
    profile: Profile

    @BeforeInsert()
    verifiedHashGenerator() {
        this.verifiedHash = generateRandomSting(10);
    }

    @BeforeInsert()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10)
    }

    @BeforeInsert()
    async createProfile() {
        const profile = new Profile()
        profile.displayName = this.username;
        await profile.save()
        this.profile = profile
    }

    toJson = () => {
        // @ts-ignore
        delete this.password;
        delete this.recoveryPasswordHash;
        delete this.verifiedHash;
        return this;
    }

    generateJwt = () => {
        return jwt.sign(
            { id: this.id, email: this.email },
            process.env.JSON_PRIVATE_KEY || '',
            { expiresIn: '24h' }
        )
    }

    async sentConfirmationEmailLinkToUser(): Promise<boolean> {
        try {
            if (this.verifiedHash) {
                await MailerService.sendMail({
                    to: this.email,
                    subject: 'Confirmation email',
                    html: ConfirmationEmail(this.verifiedHash)
                })

                return true
            }
            throw Error('Something went wrong.')
        } catch (e) {
            throw e
        }
    }

    static async confirmUser(verifiedHash: string): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { verifiedHash } })
            if (user) {
                user.status = User.statuses.VERIFIED
                user.verifiedHash = undefined
                await user.save()
                return true
            }
            throw Error('Something went wrong. Try again!')
        } catch (e) {
            throw e
        }
    }

    async sentRecoveryPasswordLinkToUser(): Promise<boolean> {
        try {
            this.recoveryPasswordHash = generateRandomSting(10)
            await MailerService.sendMail({
                to: this.email,
                subject: 'Recovery password',
                html: RecoveryPassword(this.recoveryPasswordHash)
            })
            return true
        } catch (e) {
            throw e
        }
    }

    static async recoveryPassword(recoveryPasswordHash: string, password: string): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { recoveryPasswordHash, status: User.statuses.VERIFIED } })
            if (user) {
                user.password = bcrypt.hashSync(password, 10)
                user.recoveryPasswordHash = undefined
                await user.save()
                return true
            }
            throw Error('Something went wrong. Try again!')
        } catch (e) {
            throw e
        }
    }

    static auth = async (email: string, password: string): Promise<{ token: string, user: User }> => {
        try {
            const user = await User.findOne({ where: { email } })
            if (user && bcrypt.compareSync(password, user.password)) {
                if (user.status === User.statuses.VERIFIED) {
                    return { token: user.generateJwt(), user };
                }
                throw Error('A confirmation email has been sent to your email.')
            }
            throw Error('The email or password is incorrect.')
        } catch (e: any) {
            throw e
        }
    }
}



