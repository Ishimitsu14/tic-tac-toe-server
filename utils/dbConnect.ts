import {createConnection, getConnection} from "typeorm";

export const connect = async () => {
    try {
        return await createConnection();
    } catch (error) {
        return getConnection('default');
    }
}