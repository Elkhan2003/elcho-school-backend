"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
const router = (0, express_1.Router)();
router.get("/login-google", auth_controllers_1.default.loginUserGoogle);
router.get("/login-github", auth_controllers_1.default.loginUserGitHub);
router.get("/user", auth_controllers_1.default.getUser);
router.get("/logout", auth_controllers_1.default.logoutUser);
exports.default = router;
