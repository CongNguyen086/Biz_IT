import { Appointment } from "../models"
import { AppointmentService } from "../services/appointmentService"

const appointmentService = new AppointmentService();
export const proposeAppointment = async (req, res, error) => {
    try {
        const { userId, stores, members, eventName, date } = req.body;
        const appointment = new Appointment(
            null,
            eventName,
            date,
            userId
        );
        const appointmentId = await appointmentService.createAppointment(appointment);
        await appointmentService.createAppointmentStores(stores, appointmentId);
        Promise.all(members.map(async (memberId) => {
            await appointmentService.upsertAppointmentMembers(memberId);
        }));
        
        res.status(200).json({ appointmentId });
    } catch (err) {
        res.status(500).json({ error });
    }
}