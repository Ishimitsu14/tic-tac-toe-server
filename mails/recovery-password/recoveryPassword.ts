import cheerio from 'cheerio'
import fs from 'fs'

export default (hash: string): string => {
    const mail = fs.readFileSync(`${__dirname}/recovery-password.html`)
    const $ = cheerio.load(mail)
    $('#recovery-password-link').attr('href', `${process.env.BASE_URL}/api/v1/auth/recovery-password/${hash}`)
    return $.html()
}