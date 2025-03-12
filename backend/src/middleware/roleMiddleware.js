export const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }
  
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Requiere rol de administrador" });
    }
  
    next();
  };
  
  export const isUser = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }
  
    if (req.user.role !== "USER") {
      return res.status(403).json({ message: "Requiere rol de usuario" });
    }
  
    next();
  };
  
/*   // Middleware para permitir a ambos roles acceder
  export const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }
    next();
  }; */