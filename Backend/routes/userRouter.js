import { Router } from "express";
import { getContactList, register } from "../controllers/userController";

const router = Router();
router.post('/register', register);
router.post('/contact', getContactList);

export default router;