import { Router } from "express";
import { proposeAppointment } from "../controllers/appointmentController";

const router = Router();
router.post('/create', proposeAppointment);

export default router;