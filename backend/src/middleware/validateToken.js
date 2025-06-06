import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { prisma } from "../db.js";

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No tiene autorización" });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);

    // Buscar si es un usuario
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (user) {
      req.user = user;
      req.role = user.role;
      return next();
    }

    // Buscar si es una empresa/productora
    const company = await prisma.producerCompany.findUnique({ where: { id: decoded.id } });
    if (company) {
      req.company = company;
      req.user = company; // ← línea clave para que funcione con isAuthenticated
      req.role = "PRODUCER";
      return next();
    }

    return res.status(401).json({ message: "Entidad no encontrada" });
  } catch (error) {
    return res.status(403).json({ message: "Token no validado" });
  }
};