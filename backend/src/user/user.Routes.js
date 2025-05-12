import { Router } from "express";
import { getUser, getUsers, userCreate,deleteUser, updateUser, } from "./user.Controller.js";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();


//ingresar las rutas en esta seccion en este caoso solo el user tipo admin tendra acceso a estas rutas

router.post("/user", authRequired,isAdmin,userCreate);//el tipo admin podra crear al usuario tipo user
router.get("/user", authRequired,isAdmin,getUsers);
router.get("/user/:id", authRequired, isAdmin, getUser);
router.delete("/user/:id", authRequired, isAdmin, deleteUser);
router.put("/user/:id", authRequired, isAdmin, updateUser);





export default router;

