import { Router } from "express";
import ecoRoutes from "../modules/eco/eco.routes";
import testRoutes from "../modules/test/test.routes";

const router = Router();

router.use("/", ecoRoutes);
router.use("/", testRoutes);

export default router;
