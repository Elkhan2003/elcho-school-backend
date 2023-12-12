"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_controllers_1 = __importDefault(require("./verify.controllers"));
const router = (0, express_1.Router)();
router.post("/send-sms", verify_controllers_1.default.sendSmsCodeVerify);
router.post("/check-sms", verify_controllers_1.default.checkSmsCodeVerify);
exports.default = router;
