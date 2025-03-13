import { registerUserAdmin, login, getProfile } from "./authService.js";


//controlador de registro de usuario admin
export const registerAdmin = async (req, res) => {
    try {
        const userAdmin = await registerUserAdmin(req.params);
        res.status(200).json(userAdmin)
    } catch (error) {
        res.status(400).json('error en registerUserAdmin');
    }
}

//controlador del login (es tanto para el admin como para el user)

export const loginController = async (req, res) => {
    try {
        const { ci, password } = req.body;

        // Llamamos a la función login
        const userData = await login(ci, password);

        // Guardamos el token en una cookie
        res.cookie("token", userData.token, { httpOnly: true });

        // Enviamos la respuesta
        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const logout = async (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.sendStatus(200);
};


// controlador de obtener el usuario
export const profile =async(req,res)=>{
    try {
        const {id}=req.user;
        const user = await getProfile(id);
        res.status(200).json(user);
        
    } catch (error) {
        res.status(400).json('error en getprofile');
        
    }
}