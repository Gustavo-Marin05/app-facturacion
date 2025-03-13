import { createUser } from "./userService.js";

export const userCreate = async (req, res) => {
    //es con metododo post , solo el usuario tipo admin podra crear el usuario tipo user
    //el usuario tipo user no podra crear otro usuario
    //este suario creado solo tendra acceso a la facturacion

    try {
        const user= await createUser(req.user.id, req.body);
        res.status(200).json(user);
        
    } catch (error) {
        res.status(400).json('error en ');
    }


}

export const getUser = async (req, res) => {
    //esta funcion solo pedira un usuario mientras el user tipo admin este logeado
    //el user tipo user no podra pedir un usuario

}

export const getUsers = async (req, res) => {
    //esta funcion solo pedira todos los usuarios mientras el user tipo admin este logeado
    //el user tipo user no podra pedir todos los usuarios

}

export const updateUser = async (req, res) => {
    //esta funcion solo actualizara un usuario mientras el user tipo admin este logeado
    //el user tipo user no podra actualizar un usuario

}

export const deleteUser = async (req, res) => {
    //esta funcion solo eliminara un usuario mientras el user tipo admin este logeado
    //el user tipo user no podra eliminar un usuario

}

