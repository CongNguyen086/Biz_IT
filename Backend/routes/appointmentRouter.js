import { Router } from "express";
import {
    proposeAppointment,
    getAppointmentList,
    countAppointmentSelection,
    getAppointmentStores,
    getAppointmentStoreDetails
} from "../controllers/appointmentController";

const router = Router();
router.post('/create', proposeAppointment);
router.get('/list', getAppointmentList);
router.get('/get-statistic', countAppointmentSelection);
router.get('/stores', getAppointmentStores);
router.get('/store/details', getAppointmentStoreDetails);

export default router;