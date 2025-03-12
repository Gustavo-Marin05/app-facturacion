import { prisma } from '../db.js';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt.js';



//registro de un usuario admin
export const registerUserAdmin = async (data) => {

    const { fullName, ci, password } = data;

    try {

        const adminExist = await prisma.user.findUnique({
            where: {
                ci: ci,
                role: 'ADMIN'
            }
        })

        if (adminExist) return ['este usuario ya existe'];

        if (!password) throw new Error("La contraseña es requerida");

        //encriptacion de la contraceña

        const passwordHash = await bcrypt.hash(password, 10);

        //creacion del usuario
        const newUserAdmin = await prisma.user.create({
            data: {
                fullName,
                ci,
                password: passwordHash,//pasa la contraceña hasheada
                role: 'ADMIN'
            }

        })

        const token = await createAccesToken({ id: newUserAdmin.id, role: newUserAdmin.role });
        return ({
            id: newUserAdmin.id,
            fullName: newUserAdmin.fullName,
            ci: newUserAdmin.ci,
            role: newUserAdmin.role,
            createdAt: newUserAdmin.createdAt,
            updatedAt: newUserAdmin.updatedAt,
            token
        });
    } catch (error) {

        console.log(error);
        throw new Error("Error al registrar el usuario");
    }
}

export const login = async (ci, password) => {
    try {
        if (!ci || !password) {
            throw new Error("CI y contraseña son requeridos");
        }

        // Buscar al usuario en la base de datos
        const userFound = await prisma.user.findUnique({
            where: { ci: ci }
        });

        if (!userFound) {
            throw new Error("Usuario no encontrado");
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            throw new Error("Contraseña incorrecta");
        }

        // Crear token de acceso
        const token = await createAccesToken({ id: userFound.id, role: userFound.role });

        return {
            id: userFound.id,
            fullName: userFound.fullName,
            ci: userFound.ci,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

export const getProfile =async(userId)=>{
    try {
        const userFound=await prisma.user.findUnique({
            where:{
                id:userId,
                role:'ADMIN'
            }
        })

        if(!userFound) return ['el usuario no existe'];

        return {
            id:userFound.id,
            fullName:userFound.fullName,
            ci:userFound.ci,
            role:userFound.role,
            createdAt:userFound.createdAt,
            updatedAt:userFound.updatedAt
        }
         
    } catch (error) {
        throw new Error(error.message);
    }
}