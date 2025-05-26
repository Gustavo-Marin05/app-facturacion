import { Router } from "express";
import { companyRegister, loginCompanyController } from "./authCompany.Controller.js";
import { authRequired } from "../middleware/validateToken.js"; 


const router = Router();

//rutas de la compañia
router.post('/company/register',companyRegister);
router.post('/company/login',loginCompanyController)

export default router;