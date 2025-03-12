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

        const token = await createAccesToken({ id: newUserAdmin.id });
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
            return res.status(400).json({ message: "ci and password is required" });
          }
        //primero encontramos al admin o user
        const userFound = await prisma.user.findUnique({
            where: {
                ci: ci
            }
        })
        if (!userFound) return ['user not found'];

        const isMach = await bcrypt.compare(password, userFound.password);
        if (!isMach) return ['password incorrect'];

        //creacion del token
        const token = await createAccesToken({ id: userFound.id });

        return({
            id: userFound.id,
            fullName: userFound.fullName,
            ci: userFound.ci,
            role: userFound.role,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token

        })
    } catch (error) {
        console.log(error);
        throw new Error("Error al iniciar sesion");

    }

}