import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import verifyRoutes from "../modules/verify/verify.routes";
import ecoRoutes from "../modules/eco/eco.routes";

const router = Router();

router.use("/", authRoutes);
router.use("/", verifyRoutes);
router.use("/", ecoRoutes);

export default router;
