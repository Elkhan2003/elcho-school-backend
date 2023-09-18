"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
async function default_1(app) {
    app.get("/login", auth_controllers_1.default.loginUser);
    app.get("/user", auth_controllers_1.default.getUser);
    app.get("/logout", auth_controllers_1.default.logoutUser);
}
exports.default = default_1;
