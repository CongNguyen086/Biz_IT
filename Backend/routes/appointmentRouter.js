import { Router } from "express";
import {
    proposeAppointment,
    getAppointmentList,
    countAppointmentSelection,
    getAppointmentStores,
    getAppointmentStoreDetails,
    selectAppointmentOptions, declineAppointment, updateAppointmentStatus
} from "../controllers/appointmentController";

const router = Router();
router.post('/create', proposeAppointment);
router.get('/list', getAppointmentList);
router.get('/get-statistic', countAppointmentSelection);
router.get('/stores', getAppointmentStores);
router.get('/store/details', getAppointmentStoreDetails);
router.post('/select', selectAppointmentOptions);
router.put('/decline', declineAppointment);
router.put('/update-status', updateAppointmentStatus);

export default router;