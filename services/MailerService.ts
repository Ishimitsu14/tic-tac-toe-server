import nodemailer from 'nodemailer'
import {config} from 'dotenv'

config()

export type IMail = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export class MailerService {
    static transporter = nodemailer.createTransport({
        // @ts-ignore
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || '',
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME || '', // generated ethereal user
            pass: process.env.SMTP_PASSWORD || '', // generated ethereal password
        },
    })

    static sendMail = async (mailData: IMail) => {
        try {
            return await MailerService
                .transporter
                .sendMail({
                    ...mailData,
                    from: `"Tic Tac Toe 👻" <${process.env.SMTP_USERNAME}>`
                })
        } catch (e: any) {
            throw e
        }
    }
}