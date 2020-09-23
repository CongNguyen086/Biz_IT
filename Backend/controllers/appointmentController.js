import { Appointment } from "../models"
import AppointmentService from "../services/appointmentService"

const appointmentService = new AppointmentService();
export const proposeAppointment = async (req, res) => {
    try {
        const newAppointmentId = await appointmentService.createNewAppointmentInfo(req.body);
        res.status(200).json({ newAppointmentId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}