import MysqlClient from "../config/db";

export default class storeService {
    constructor() {
        this.client = MysqlClient.getInstance();
    }

    async getAllStores() {
        try {
            const knex = this.client.connection;
            const query = await knex.select(['s.*', 'm.serviceId', 'm.icon', 'c.categoryId', 'c.categoryName', 'p.description'])
                .from('merchants AS m')
                .join('categories AS c', 'm.categoryId', 'c.categoryId')
                .join('stores AS s', 's.serviceId', 'm.serviceId')
                .leftJoin('promotions AS p', 'p.serviceId', 's.serviceId');
            return JSON.parse(JSON.stringify(query));;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAppointmentStoresById(appointmentId) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .raw(`CALL GetAppointmentDetails(?)`, [appointmentId]);
            return JSON.parse(JSON.stringify(query[0][0]));;
        } catch (error) {
            throw new Error(error);
        }
    }
}