import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { customError } from "./errorHandlerMiddleware";
import User from "../model/userModel";

interface IToken {
  id: number;
  email: string;
  login: string;
  iat: number;
  exp: number;
}
export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.method === "OPTIONS") {
      next();
    }
    const token = req.header("Authorization")?.replace("Bearer ", "")?.trim();
    if (!token) {
      return next(customError.forbidden("No token"));
    }
    const decoded: IToken = <IToken>jwt.verify(token, `${process.env.secret}`);
    if (Date.now() >= decoded.exp * 1000) {
      return next(customError.forbidden("Token is expired"));
    }
    const candidate = await User.findOne({
      where: { email: decoded.email },
    });
    if (!candidate) {
      return next(customError.forbidden("Corrupted token"));
    }
    if (candidate.token !== req.cookies.refresh_token) {
      return next(customError.forbidden("Corrupted token"));
    }
    req.body.id = candidate.id;
    next();
  } catch (e) {
    console.log(req.header("Authorization"));
    console.log(e);
    return next(customError.forbidden("Access denied for other reasons"));
  }
}
