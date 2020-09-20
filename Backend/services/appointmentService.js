import MysqlClient from "../config/db";

export class AppointmentService {
    constructor() {
        this.client = MysqlClient.getInstance();
    }

    async createAppointment(appointment) {
        const knex = this.client.connection;
        const [id] = await knex.insert(appointment).into("appointments");
        return id;
    }

    createAppointmentStores(storeIds, appointmentId) {
        const knex = this.client.connection;
        const data = [];
        for (const storeId of storeIds) {
            data.push({ storeId, appointmentId });
        }
        return knex.insert(data).into("appointment_stores");
    }

    upsertAppointmentMembers(memberId, patch) {
        const knex = this.client.connection;
        if (patch) {
            // TODO: Update member status
            return;
        }

        return knex.insert({ memberId }).into("appointment_members");
    }
}