import express from "express";
import * as users from "../controllers/users";

const router = express.Router();

router.post("/login", users.login);
router.post("/register", users.register);
router.post("/logout", users.logout);
router.get("/", users.all);
router.post("/google", users.googleSignOn)

export default router;