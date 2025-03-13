import { Router } from "express";
<<<<<<< HEAD
import { getUser, getUsers, userCreate } from "./user.Controller.js";
=======
import { deleteUser, getUsers, userCreate } from "./user.Controller.js";
>>>>>>> ce160d9d6a9727e71ed4e53895f8e8b6d3b78077
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();


//ingresar las rutas en esta seccion en este caoso solo el user tipo admin tendra acceso a estas rutas

router.post("/user", authRequired,isAdmin,userCreate);
router.get("/user", authRequired,isAdmin,getUsers);
<<<<<<< HEAD
router.get("/user/:id", authRequired, isAdmin, getUser);
=======
router.delete("/user/:id", authRequired, isAdmin, deleteUser);
>>>>>>> ce160d9d6a9727e71ed4e53895f8e8b6d3b78077




export default router;

