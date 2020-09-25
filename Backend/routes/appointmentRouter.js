import { Router } from "express";
import {
    proposeAppointment,
    getAppointmentList,
    countAppointmentSelection,
    getAppointmentStores,
} from "../controllers/appointmentController";

const router = Router();
router.post('/create', proposeAppointment);
router.get('/list', getAppointmentList);
router.get('/get-statistic', countAppointmentSelection);
router.get('/stores', getAppointmentStores);

export default router;