import { Router } from "express";
import testControllers from "./test.controllers";

const router = Router();

router.post("/send-for-elkhan", testControllers.sendData);

export default router;
