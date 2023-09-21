import { Router } from "express";
import authControllers from "./auth.controllers";

const router = Router();

router.get("/login", authControllers.loginUser);
router.get("/user", authControllers.getUser);
router.get("/logout", authControllers.logoutUser);

export default router;
