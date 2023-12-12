import { Router } from "express";
import errorControllers from "./error.controllers";

const router = Router();

router.post("/error", errorControllers.sendError);

export default router;
