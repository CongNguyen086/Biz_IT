import MysqlClient from "../config/db";
import { AppointmentStatus, MemberStatus } from "../constants/appointment";
import { uniqBy } from "lodash";
import { ResponseError } from "../models/Error";

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
            throw new ResponseError(error);
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
            throw new ResponseError(error);
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
            throw new ResponseError(error);
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
            throw new ResponseError(error);
        }
    }

    async countAppointmentSelection(appointments) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .select([
                    "appointmentId",
                    knex.raw(`COALESCE(COUNT(IF(status <> 1, 1, null)), 0) AS votedNumber`),
                    knex.raw(`COALESCE(COUNT(IF(status = 2, 1, null)), 0) AS selectedNumber`)
                ])
                .from(knex.raw(`
                    (SELECT appointmentId, memberId, status
                    FROM appointment_members
                    WHERE appointmentId IN (${appointments.map(_ => "?").join(",")})
                    GROUP BY appointmentId, memberId, status) AS am
                `, [...appointments]))
                .groupBy("appointmentId");
            return JSON.parse(JSON.stringify(query));
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentList(userId, appointmentId) {
        try {
            const knex = this.client.connection;
            const param = appointmentId ? [userId, appointmentId] : [userId, null];
            const query = await knex
                .raw(`
                    CALL GetAppointmentList(?, ?)
                `, param);
            // Return appointment list info
            const appointments = JSON.parse(JSON.stringify(query[0][0]));
            // Get appointment number of voted member & number of selected member
            if (!appointments.length) {
                return [];
            }
            const appointmentStatistic = await this.countAppointmentSelection(
                appointments.map(appointment => appointment.appointmentId)
            );
            return appointments.map(element => {
                const correspondingStatistic = appointmentStatistic.find(item => item.appointmentId === element.appointmentId);
                return Object.assign({}, correspondingStatistic, element);
            });
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentById(id) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .select("*")
                .from("appointments")
                .where("id", id)
                .first();
            return JSON.parse(JSON.stringify(query));
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentMemberInfo(appointmentId, memberId) {
        try {
            const knex = this.client.connection;
            const query = await knex.raw(`
                SELECT appointmentId, memberId, status
                FROM appointment_members
                WHERE appointmentId = ? AND memberId = ?
                GROUP BY appointmentId, memberId, status
            `, [appointmentId, memberId]);
            return JSON.parse(JSON.stringify(query[0][0]));
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async selectAppointmentStores(appointmentId, memberId, storeIds) {
        try {
            const knex = this.client.connection;
            let appointment = await this.getAppointmentById(appointmentId);
            console.log("AppointmentService -> selectAppointmentStores -> appointment", appointment)
            if (appointment?.statusId !== AppointmentStatus.waiting) {
                return new ResponseError("The appointment does not exist or has ended");
            }
            const appointmentInfo = await this.getAppointmentMemberInfo(appointmentId, memberId);
            console.log("AppointmentService -> selectAppointmentStores -> appointmentInfo", appointmentInfo);

            if (!appointmentInfo?.memberId) {
                return new ResponseError("You are not a participant of this appointment");
            }

            if (appointmentInfo.status !== MemberStatus.waiting) {
                return new ResponseError("You have interacted with this appointment");
            }

            const inserted = [];
            await Promise.all(storeIds.map(async (storeId) => {
                await knex
                    .delete("*")
                    .from("appointment_members")
                    .where({
                        appointmentId,
                        memberId
                    })
                const query = await knex
                    .select("*")
                    .from("appointment_stores")
                    .where({
                        storeId,
                        appointmentId
                    })
                    .first();
                const store = JSON.parse(JSON.stringify(query));
                inserted.push({
                    appointmentStoreId: store.id,
                    memberId,
                    appointmentId,
                    status: MemberStatus.selected
                });
            }));
            await knex.insert(inserted).into("appointment_members");

            appointment = await this.getAppointmentList(memberId, appointmentId);
            const appointmentDetails = await this.getAppointmentDetails(appointmentId);
            return Object.assign({}, appointment[0], appointmentDetails);
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async declineAppointment(appointmentId, memberId) {
        try {
            const knex = this.client.connection;
            let appointment = await this.getAppointmentById(appointmentId);
            console.log("AppointmentService -> selectAppointmentStores -> appointment", appointment)
            if (appointment?.statusId !== AppointmentStatus.waiting) {
                return new ResponseError("The appointment does not exist or has ended");
            }
            const appointmentInfo = await this.getAppointmentMemberInfo(appointmentId, memberId);
            console.log("AppointmentService -> selectAppointmentStores -> appointmentInfo", appointmentInfo);

            if (!appointmentInfo?.memberId) {
                return new ResponseError("You are not a participant of this appointment");
            }

            if (appointmentInfo.status !== MemberStatus.waiting) {
                return new ResponseError("You have interacted with this appointment");
            }

            await knex.update({ status: MemberStatus.declined })
                .into("appointment_members")
                .where({
                    appointmentId,
                    memberId
                });

            appointment = await this.getAppointmentList(memberId, appointmentId);
            const appointmentDetails = await this.getAppointmentDetails(appointmentId);
            return Object.assign({}, appointment[0], appointmentDetails);
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentMembers(appointmentId) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .select([
                    "u.userId",
                    "u.fullName",
                    "u.userPhone",
                    "am.status AS statusId",
                    "ms.label AS status"
                ])
                .from("appointment_members AS am")
                .join("users AS u", "am.memberId", "u.userId")
                .join("member_status AS ms", "am.status", "ms.id")
                .where("am.appointmentId", appointmentId);
            return JSON.parse(JSON.stringify(query));
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentMemberStoreDetails(appointmentId) {
        try {
            const knex = this.client.connection;
            const query = await knex
                .select([
                    "am.memberId",
                    "s.*",
                ])
                .from("appointment_stores AS ast")
                .leftJoin("appointment_members AS am", "ast.id", "am.appointmentStoreId")
                .join("store_promotion AS s", "ast.storeId", "s.storeId")
                .where("ast.appointmentId", appointmentId);
            return JSON.parse(JSON.stringify(query));
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async getAppointmentDetails(appointmentId) {
        try {
            const knex = this.client.connection;
            const appointmentInfo = await knex
                .select([
                    "a.*",
                    "u.fullName AS hostName",
                    "ast.label AS eventStatus",
                    "s.storeName",
                    "s.storeAddress AS meetingPlace"
                ])
                .from("appointments AS a")
                .join("appointment_status AS ast", "a.statusId", "ast.id")
                .join("users AS u", "a.hostId", "u.userId")
                .leftJoin("stores AS s", "a.appointmentStore", "s.storeId")
                .where("a.id", appointmentId)
                .first();
            if (!appointmentInfo) {
                return new ResponseError("Appointment does not exist");
            }
            appointmentInfo.appointmentId = appointmentInfo.id;
            delete appointmentInfo.id;
            console.log("AppointmentService -> getAppointmentDetails -> appointmentInfo", appointmentInfo)
            const appointmentMembers = await this.getAppointmentMembers(appointmentId);
            const appointmentMemberStoreDetails = await this.getAppointmentMemberStoreDetails(appointmentId);
            // Get stores info including basic info and a list of selected members' ids
            const stores = [];
            appointmentMemberStoreDetails.map(item => {
                const foundStoreDetails = stores.find(element => element.storeId === item.storeId);
                const memberId = item.memberId;
                const member = appointmentMembers.find(member => (member.userId === memberId && member.statusId === MemberStatus.selected));
                delete item.memberId;
                if (!foundStoreDetails) {
                    if (member) {
                        item.selectedMembers = [memberId];
                    } else {
                        item.selectedMembers = [];
                    }
                    stores.push(item);
                } else {
                    memberId
                        && member
                        && foundStoreDetails.selectedMembers.push(memberId);
                }
            });
            return {
                ...appointmentInfo,
                members: uniqBy(appointmentMembers, "userId"),
                stores,
            };
        } catch (error) {
            throw new ResponseError(error);
        }
    }

    async updateAppointmentStatus(appointmentId, userId, status, storeId) {
        try {
            const knex = this.client.connection;
            if (!AppointmentStatus.hasOwnProperty(status)) {
                return new ResponseError("Wrong status for appointment");
            }
            let appointment = await this.getAppointmentById(appointmentId);
            const appointmentStatus = appointment.statusId;
            console.log("AppointmentService -> selectAppointmentStores -> appointment", appointment)

            if (!appointment) {
                return new ResponseError("The appointment does not exist");
            }
            if (appointment.hostId !== userId) {
                console.log("AppointmentService -> updateAppointmentStatus -> appointment.hostId", appointment.hostId)
                return new ResponseError("You don't have permission to update this appointment");
            }
            if (appointmentStatus === AppointmentStatus.canceled) {
                return new ResponseError("This appointment has been canceled");
            }
            if (appointmentStatus === AppointmentStatus.completed && status === "completed") {
                return new ResponseError("You have marked this appointment as completed");
            }
            const patch = { statusId: AppointmentStatus[status] };
            if (storeId && status === "completed") patch.appointmentStore = storeId;

            await knex.update(patch)
                .into("appointments")
                .where("id", appointmentId);

            appointment = await this.getAppointmentList(userId, appointmentId);
            const appointmentDetails = await this.getAppointmentDetails(appointmentId);
            return Object.assign({}, appointment[0], appointmentDetails);
        } catch (error) {
            throw new ResponseError(error);
        }
    }
}