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

    async countAppointmentSelection(appointments) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .select([
                    "appointmentId",
                    knex.raw(`COUNT(memberId) AS votedNumber`),
                    knex.raw(`COUNT(IF(status = 2, 1, null)) AS selectedNumber`)
                ])
                .from(knex.raw(`
                    (SELECT appointmentId, memberId, status
                    FROM appointment_members
                    WHERE status <> 1 AND appointmentId IN (${appointments.map(_ => "?").join(",")})
                    GROUP BY appointmentId, memberId, status) am
                `, [...appointments]))
                .groupBy("appointmentId");
            return JSON.parse(JSON.stringify(query));
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAppointmentList(userId) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .raw(`
                    CALL GetAppointmentList(?)
                `, [userId]);
            // Return appointment list info
            const appointments = JSON.parse(JSON.stringify(query[0][0]));
            // Get appointment number of voted member & number of selected member
            const appointmentStatistic = await this.countAppointmentSelection(
                appointments.map(appointment => appointment.id)
            );
            console.log("AppointmentService -> getAppointmentList -> appointmentStatistic", appointmentStatistic)
            return appointments.map(element => {
                const correspondingStatistic = appointmentStatistic.filter(item => item.appointmentId === element.id);
                return Object.assign({}, element, correspondingStatistic[0]);
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}