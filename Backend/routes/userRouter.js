import { Router } from "express";
import { getContactList } from "../controllers/userController";

const router = Router();
router.post('/contact', getContactList);

export default router;