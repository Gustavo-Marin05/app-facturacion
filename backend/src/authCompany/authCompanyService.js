import { prisma } from "../db.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";

import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

//registro de una empresa productora
export const registerCompany = async (data) => {
  const { name, nit, email, password, address, phone } = data;

  try {
    const companyExist = await prisma.producerCompany.findFirst({
      where: { nit, email },
    });

    if (companyExist) return ["la empresa ya existe"];

    const passwordHash = await bcrypt.hash(password, 10);

    const newProducerCompany = await prisma.producerCompany.create({
      data: {
        name,
        nit,
        email,
        password: passwordHash,
        address,
        phone,
      },
    });

    const token = await createAccesToken({
      id: newProducerCompany.id,
    });

    return {
      id: newProducerCompany.id,
      name: newProducerCompany.name,
      nit: newProducerCompany.nit,
      email: newProducerCompany.email,
      addres: newProducerCompany.address,
      phone: newProducerCompany.phone,
      token,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error al registrar el usuario");
  }
};

//login de la empresa
export const loginCompany = async (nit, email, password) => {
  try {
    if (!email || !password || !nit) {
      throw new Error("CI nit y contraseña son requeridos");
    }

    // Buscar al usuario en la base de datos
    const companyFound = await prisma.producerCompany.findFirst({
      where: {
        AND: [{ email: email }, { nit: nit }],
      },
    });

    if (!companyFound) {
      throw new Error("Company no encontrado");
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, companyFound.password);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    // Crear token de acceso
    const token = await createAccesToken({
      id: companyFound.id,
    });

    return {
      id: companyFound.id,
      name: companyFound.name,
      nit: companyFound.nit,
      email: companyFound.email,
      address: companyFound.address,
      phone: companyFound.phone,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getProfileCompany = async (companyId) => {
  try {
    const companyFound = await prisma.producerCompany.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!companyFound) return ["la compania no existe"];

    return {
      id: companyFound.id,
      name: companyFound.name,
      nit: companyFound.nit,
      email: companyFound.email,
      addres: companyFound.address,
      phone: companyFound.phone,
      createdAt: companyFound.createdAt,
      updatedAt: companyFound.updatedAt,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

//verifica el token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado: token no encontrado" });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    try {
      // decoded.id fue insertado cuando se generó el token en registerCompany
      const companyFound = await prisma.producerCompany.findUnique({
        where: { id: decoded.id },
      });

      if (!companyFound) {
        return res.status(401).json({ message: "Empresa no autorizada" });
      }

      return res.json({
        id: companyFound.id,
        name: companyFound.name,
        email: companyFound.email,
        nit: companyFound.nit,
        address: companyFound.address,
        phone: companyFound.phone,
        createdAt: companyFound.createdAt,
        updatedAt: companyFound.updatedAt,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error al verificar el token" });
    }
  });
};
