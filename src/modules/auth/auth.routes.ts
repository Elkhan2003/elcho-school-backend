import { Router } from "express";
import authControllers from "./auth.controllers";

const router = Router();

router.get("/login-google", authControllers.loginUserGoogle);
router.get("/login-github", authControllers.loginUserGitHub);
router.get("/user", authControllers.getUser);
router.get("/logout", authControllers.logoutUser);

export default router;
