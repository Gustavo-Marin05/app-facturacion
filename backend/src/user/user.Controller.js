import { createUser, getAllUsers, deleteUserById, getaUser, updateUserById } from "./userService.js";


export const userCreate = async (req, res) => {
    //es con metododo post , solo el usuario tipo admin podra crear el usuario tipo user
    //el usuario tipo user no podra crear otro usuario
    //este suario creado solo tendra acceso a la facturacion
    const {fullName,ci,password}=req.body

    try {
        const user = await createUser(req.user.id, {fullName,ci,password});
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json('error en ');
    }


}

export const getUser = async (req, res) => {
    //esta funcion solo pedira un usuario mientras el user tipo admin este logeado
    //el user tipo user no podra pedir un usuario
    try {
        const user = await getaUser(req.user.id, req.params.id);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener usuario" });
    }


}

export const getUsers = async (req, res) => {
    //esta funcion solo pedira todos los usuarios mientras el user tipo admin este logeado
    //el user tipo user no podra pedir todos los usuarios

    try {
        const user = await getAllUsers(req.user.id);
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json('error en ');
    }

}

export const updateUser = async (req, res) => {
    //esta funcion solo actualizara un usuario mientras el user tipo admin este logeado
    //el user tipo user no podra actualizar un usuario

    const {fullName,ci,password}=req.body

    try {
        const user = await updateUserById(req.user.id, req.params.id, {fullName,ci,password});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json('error en updateproductbyid ');
    }

}


export const deleteUser = async (req, res) => {
    try {
        const result = await deleteUserById(req.user.id, req.params.id); // Pasar el ID del admin

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

