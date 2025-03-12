import { registerUserAdmin } from "./authService.js";


//controlador de registro de usuario admin
export const registerAdmin = async (req, res) => {
    try {
        const userAdmin = await registerUserAdmin(req.body);
        res.status(200).json(userAdmin)
    } catch (error) {
        res.status(400).json('error en registerUserAdmin');
    }
}

//controlador del login (es tanto para el admin como para el user)

export const login = async (req, res) => {
    try {
        const login = await login(req.body);
        res.status(200).json(login);
    } catch (error) {
        res.status(400).json('error en');
    }
}