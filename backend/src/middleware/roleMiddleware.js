export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Requiere rol de administrador" });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "USER") {
    return res.status(403).json({ message: "Requiere rol de usuario" });
  }
  next();
};

export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
};

export const isAdminOrCompany = (req, res, next) => {
  if ((req.user && req.user.role === "ADMIN") || req.company) {
    return next();
  }
  return res.status(403).json({ message: "Se requiere rol de administrador o empresa" });
};
