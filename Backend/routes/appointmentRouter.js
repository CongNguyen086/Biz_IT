import { Router } from "express";
import { proposeAppointment, getAppointmentList, countAppointmentSelection } from "../controllers/appointmentController";

const router = Router();
router.post('/create', proposeAppointment);
router.get('/list', getAppointmentList);
router.get('/get-statistic', countAppointmentSelection);

export default router;