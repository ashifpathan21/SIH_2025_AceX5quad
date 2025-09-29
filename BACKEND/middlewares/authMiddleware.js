import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// role-based access
export const isPrincipal = (req, res, next) => {
  if (req.user.role !== "principal")
    return res.status(403).json({ message: "Only principals allowed" });
  next();
};

export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Only teachers allowed" });
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Only students allowed" });
  next();
};
