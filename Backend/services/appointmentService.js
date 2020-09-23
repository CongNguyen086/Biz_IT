import MysqlClient from "../config/db";

export default class AppointmentService {
    constructor() {
        this.client = MysqlClient.getInstance();
    }

    async createAppointment(appointment) {
        try {
            const knex = this.client.connection;
            const [id] = await knex.insert(appointment).into("appointments");
            return id;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createAppointmentStores(storeIds, appointmentId) {
        try {
            const knex = this.client.connection;
            const data = [];
            for (const storeId of storeIds) {
                data.push({ storeId, appointmentId });
            }
            return await knex.insert(data).into("appointment_stores");
        } catch (error) {
            throw new Error(error);
        }
    }

    async upsertAppointmentMembers(memberId, appointmentId, patch) {
        try {
            const knex = this.client.connection;
            if (patch) {
                // TODO: Update member status
                return;
            }

            return await knex.insert({ memberId, appointmentId }).into("appointment_members");
        } catch (error) {
            throw new Error(error);
        }
    }

    async createNewAppointmentInfo(appointment) {
        try {
            const {
                eventName,
                meetingDate,
                hostId,
                stores,
                members
            } = appointment;
            const knex = this.client.connection;

            const appointmentId = await this.createAppointment({
                eventName,
                meetingDate,
                hostId
            });
            Promise.all([
                this.createAppointmentStores(stores, appointmentId),
                ...members.map(async (memberId) => {
                    await this.upsertAppointmentMembers(memberId, appointmentId);
                })
            ]);
            return appointmentId;
        } catch (error) {
            throw new Error(error);
        }
    }

    // async getAppointmentList(appointment) {
    //     try {
    //         await knex
    //         .raw("select ")
    //     } catch (error) {
            
    //     }
    // }
}