import { Router } from "express";
import { registerAdmin, loginController, logout, profile } from "./auth.Controller.js";
import { isAdmin, isAuthenticated } from "../middleware/roleMiddleware.js";
import { authRequired } from "../middleware/validateToken.js";

const router = Router();

//rutas que solo el admin puede usar
router.post("/register", registerAdmin);
router.get("/profile", authRequired, isAuthenticated, profile);

//estas rutas tambien sirven para el ADMIN y USER
router.post("/login", loginController);
router.post("/logout", logout);


export default router;