import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";

/**Authenticates user's token */
export async function authenticate(req: Request,res: Response,next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) {
      return res.status(401).send({ msg: "No token, kindly login" });
    }

    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error: unknown) {
    return res.status(401).send("Invalid token, kindly login");
  }
}


declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}