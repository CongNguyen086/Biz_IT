import { v4 as uuidv4 } from "uuid";
import MysqlClient from "../config/db";
import { ResponseError } from "../models/Error";

export default class UserService {
    constructor() {
        this.client = MysqlClient.getInstance();
    }

    async register({ fullName, phone, password }) {
        try {
            const knex = this.client.connection;
            const userId = Math.random().toString(36).substring(7);
            const existingPhone = await this.getUserByPhone(phone);
            if (existingPhone) {
                return new ResponseError("Phone number has been registered");
            }
            const [id] = await knex
                .insert({
                    userId,
                    fullName,
                    userPhone: phone,
                    userPassword: password,
                })
                .into("users");
            return id;
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getUserByPhone(phone) {
        try {
            const knex = this.client.connection;
            const user = await knex
                .select("*")
                .from("users")
                .where("userPhone", phone)
                .first();
            return user;
        } catch (error) {
            throw new ResponseError(error);
        }
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