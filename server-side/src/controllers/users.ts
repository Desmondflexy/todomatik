import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from "bcryptjs";
import { attachToken, generateToken, devLog } from "../utils";
import * as v from "../validators";

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.send("user logged out successfully from server");
}

export async function register(req: Request, res: Response) {
  try {
    // validate user input
    const result = v.registerValidator.validate(req.body, v.validationOptions);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let input = result.value;
    const email = input.email;
    let password = input.password;

    // check if email already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("Email already exists");

    // hash password
    password = await bcrypt.hash(password, 10);
    input = { ...input, password };

    // create user account
    user = new User(input);
    await user.save();

    res.status(201).json({ message: "register successful", userId: user._id });
  } catch (error) {
    devLog(error);
    res.status(500).send("Internal server error" );
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = v.loginValidator.validate(req.body, v.validationOptions);
    if (result.error) return res.status(400).send("Invalid login details");

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).send("Invalid login details");
    }

    const isValidPassword = await bcrypt.compare(password, user.password as string);
    if (!isValidPassword) {
      return res.status(400).send("Invalid login details");
    }
    const token = generateToken(user._id);
    attachToken(token, res);

    return res.json({ token, firstName: user.fullname.split(" ")[0] });
  } catch (error: any) {
    return res.status(500).send("Internal server error");
  }
}

export async function all(req: Request, res: Response) {
  try {
    const users = await User.find().select("fullname email");
    res.json({ users });
  } catch (error) {
    devLog(error);
    return res.status(500).send("Internal Server Error");
  }
}

export async function googleSignOn(req: Request, res: Response) {
  try {
    const { id, email, name } = req.body;
    const { error } = v.googleSignOn.validate(req.body, v.validationOptions);
    if (error) return res.status(400).send("Invalid data from google sign on");
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullname: name,
        email,
        ssoId: id,
      });
    } else if (!user.ssoId) {
      user.ssoId = id;
      await user.save();
    }
    const token = generateToken(user._id);
    attachToken(token, res);
    return res.json({ token, firstName: user.fullname.split(" ")[0] });
  } catch (error: any) {
    devLog(error);
    return res.status(500).send("Internal server error");
  }
}
