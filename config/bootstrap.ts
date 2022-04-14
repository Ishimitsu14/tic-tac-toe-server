import { DataSource } from "typeorm";
import { config } from 'dotenv';


export = async () => {
    config();
    try {
        const AppDataSource = new DataSource({
            // @ts-ignore
            type: process.env.DB_DRIVER,
            host: process.env.DB_HOST,
            // @ts-ignore
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [
                `${__dirname}/../models/*{.js,.ts}`
            ],
            synchronize: true
        })
        await AppDataSource.initialize()
        return true;
    } catch (e) {
        console.log(e)
        throw Error('Error after bootstrap');
    }
}
