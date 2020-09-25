import MysqlClient from "../config/db";

export default class UserService {
    constructor() {
        this.client = MysqlClient.getInstance();
    }

    async getContactList(phoneList) {
        const knex = this.client.connection;
        return await knex
            .select([
                "userId",
                "fullName",
                "userPhone",
            ])
            .from("users")
            .whereIn("userPhone", phoneList);
    }
}