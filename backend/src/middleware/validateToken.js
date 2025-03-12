import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js"; 

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) return res.status(401).json({ message: "No tiene autorización" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token no validado" });

       // console.log("Usuario autenticado desde el token:", user); // 🔍 Debug: Verificar contenido del token

        req.user = user;
        next();
    });
};
