import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayLoad{
    sub: string,
    role: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensgem: "Token não informado",
    });
  }
    const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      mensagem: "Token inválido",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      mensagem: "JWT_SECRET não configurado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayLoad;

    req.usuarioId = decoded.sub;
    req.usuarioRole = decoded.role;

    return next()

  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido",
    });
  }
}

//identifica se o usuário é admin se sim, permite o acesso, se não, retorna 403
export function adminMiddleware(
  req: Request,  res: Response,  next: NextFunction
) {
  if (req.usuarioRole !== "ADMIN") {
    return res.status(403).json({
      mensagem: "Acesso permitido apenas para administradores.",
    });
  }

  return next();
}