import cheerio from 'cheerio'
import fs from 'fs'

export default (hash: string): string => {
    const mail = fs.readFileSync(`${__dirname}/confirmation-email.html`)
    const $ = cheerio.load(mail)
    $('#confirm-link').attr('href', `${process.env.BASE_URL}/api/v1/auth/confirm-email/${hash}`)
    return $.html()
}