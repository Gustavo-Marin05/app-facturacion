import { Router } from "express";
import { userCreate } from "./user.Controller.js";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();


//ingresar las rutas en esta seccion en este caoso solo el user tipo admin tendra acceso a estas rutas

router.post("/user", authRequired,isAdmin,userCreate);




export default router;

