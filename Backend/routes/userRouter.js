// import { Router as router } from "express";
import { Router } from "express";
import { getContactList } from "../controllers/userController";

const router = Router();
router.get('/contact', getContactList);

export default router;