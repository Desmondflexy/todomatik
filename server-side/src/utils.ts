import jwt from "jsonwebtoken";
import { IUser } from "./models/users";
import { Response } from "express";
import { connect, connection } from "mongoose";

/** Generate a token for the user on successful login */
export function generateToken(user: IUser) {
  const secretKey = process.env.JWT_SECRET as string;
  const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 60 * 60;
  const jwtPayload = { id: user._id };
  return jwt.sign(jwtPayload, secretKey, { expiresIn });
}

/** Verify the token sent by the user and returns the decoded token */
export function verifyToken(token: string) {
  const secretKey = process.env.JWT_SECRET as string;
  return jwt.verify(token, secretKey);
}

/** Attach the token to the authorization headers and save in cookies*/
export function attachToken(
  token: string,
  res: Response,
  expiresIn: number = Number(process.env.JWT_EXPIRES_IN) * 60 * 60
) {
  res.setHeader("Authorization", `Bearer ${token}`);
  res.cookie("token", token, { maxAge: expiresIn * 1000, httpOnly: true });
}

/** Connect to the MongoDB database */
export function connectMongoDB(databaseName: string) {
  const environment = process.env.NODE_ENV || "development";
  let databaseUrl = process.env.DATABASE_URL as string;
  let text = "the shared";
  if (environment === "development") {
    databaseUrl = `mongodb://localhost:27017/${databaseName}`;
    text = "your local";
  }

  connect(databaseUrl)
    .then(() => devLog(`Connected to ${text} database successfully`))
    .catch((err) => console.error("Error connecting to Database: ", err));

  // Event listeners for disconnection
  connection.on("disconnected", () => {
    devLog("Disconnected from the database");
  });
}

/** Log messages only in development mode */
export function devLog(message: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
}
