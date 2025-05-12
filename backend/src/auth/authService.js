import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";

import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

//registro de un usuario admin
export const registerUserAdmin = async (data) => {
  const { fullName, email, ci, password } = data;

  try {
    if (!fullName) throw new Error("El campo 'FullName' es obligatorio");
    if (!ci) throw new Error("El campo 'ci' es obligatorio");
    if (!password) throw new Error("La contraseña es requerida");

    const adminExist = await prisma.user.findFirst({
      where: { email, role: "ADMIN" },
    });

    if (adminExist) return ["Este usuario ya existe"];

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserAdmin = await prisma.user.create({
      data: {
        fullName,
        email,
        ci,
        password: passwordHash,
        role: "ADMIN",
      },
    });

    const token = await createAccesToken({
      id: newUserAdmin.id,
      role: newUserAdmin.role,
    });

    return {
      id: newUserAdmin.id,
      fullName: newUserAdmin.fullName,
      email: newUserAdmin.email,
      ci: newUserAdmin.ci,
      role: newUserAdmin.role,
      createdAt: newUserAdmin.createdAt,
      updatedAt: newUserAdmin.updatedAt,
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error al registrar el usuario");
  }
};

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("CI y contraseña son requeridos");
    }

    // Buscar al usuario en la base de datos
    const userFound = await prisma.user.findUnique({
      where: { email: email },
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
    const token = await createAccesToken({
      id: userFound.id,
      role: userFound.role,
    });

    return {
      id: userFound.id,
      fullName: userFound.fullName,
      email: userFound.email,
      ci: userFound.ci,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProfile = async (userId) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFound) return ["el usuario no existe"];

    return {
      id: userFound.id,
      fullName: userFound.fullName,
      email: userFound.email,
      ci: userFound.ci,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No autorizado: token no encontrado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido o expirado" });

    const userFound = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userFound) return res.status(401).json({ message: "Usuario no autorizado" });

    return res.json({
      id: userFound.id,
      fullName: userFound.fullName,
      email: userFound.email,
      ci: userFound.ci,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  });
};
