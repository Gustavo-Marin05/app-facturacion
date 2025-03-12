import { Router } from "express";
import { registerAdmin } from "./auth.Controller.js";

const router = Router();

router.post("/register", registerAdmin);

export default router;