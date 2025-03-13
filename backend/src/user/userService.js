import {prisma} from '../db.js'
import bcrypt from 'bcryptjs'


//funcion para crear un usuario 
export const createUser = async (idAdmin, data) => {
    try {
        const { fullName, ci, password, role } = data;

        if (!fullName || !ci || !password) {
            return { error: "required" };
        }

        // Verificar si el usuario ya existe
        const userFound = await prisma.user.findUnique({
            where: { ci :ci, role: 'USER'}
        });

        if (userFound) return ['user already exists'];

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario y asignarle el ID del ADMIN
        const newUser = await prisma.user.create({
            data: {
                fullName,
                ci,
                password: passwordHash,
                role: role || 'USER',
                idAdmin: idAdmin // Relacionar con el ADMIN que lo creó
            }
        });

        return {
            id: newUser.id,
            fullName: newUser.fullName,
            ci: newUser.ci,
            role: newUser.role,
            idAdmin: newUser.idAdmin,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

    } catch (error) {
        console.error("Error al crear usuario:", error);
        return { error: "Error interno del servidor" };
    }
};

//funcion para obtener un usuario
export const getaUser=async(idAdmin,id)=>{
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: Number(id),  
                idAdmin: Number(idAdmin)
            }
        });

        if (!user) {
            return { error: "Usuario no encontrado o no autorizado" };
        }

        return user;

    } catch (error) {
        console.error("Error en getaUser:", error);
        return { error: "Error interno del servidor" };
    }
}


//funcion para obtener todos los usuarios
export const getAllUsers = async(idAdmin)=>{
    try {
        const users= await prisma.user.findMany({
            where:{
                idAdmin:idAdmin
            }
        });
        return users;
        
    } catch (error) {
        console.log('error en getUsers', error);
    }

}


//funcion para actualizar un usuario
export const updateUserById=async()=>{

}


//funcion para eliminar un usuario
export const deleteUserById = async (idAdmin, userId) => {
    try {
        const userIdNum = parseInt(userId, 10); // Convertir el ID a número

        if (isNaN(userIdNum)) {
            return { error: "Invalid user ID" };
        }

        // Verificar si el usuario existe y fue creado por el admin actual
        const userFound = await prisma.user.findUnique({
            where: { id: userIdNum }
        });

        if (!userFound) {
            return { error: "User not found" };
        }

        if (userFound.idAdmin !== idAdmin) {
            return { error: "Unauthorized action" };
        }

        // Eliminar usuario
        await prisma.user.delete({
            where: { id: userIdNum }
        });

        return { message: "User deleted successfully" };

    } catch (error) {
        console.error("Error deleting user:", error);
        return { error: "Internal server error" };
    }
};
