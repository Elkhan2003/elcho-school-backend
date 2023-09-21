import { Router } from "express";
import verifyControllers from "./verify.controllers";

const router = Router();

router.post("/send-sms", verifyControllers.sendSmsCodeVerify);

export default router;
