"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const verify_routes_1 = __importDefault(require("../modules/verify/verify.routes"));
const error_routes_1 = __importDefault(require("../modules/error/error.routes"));
async function default_1(app) {
    app.register(auth_routes_1.default, {
        prefix: "/"
    });
    app.register(verify_routes_1.default, {
        prefix: "/"
    });
    app.register(error_routes_1.default, {
        prefix: "/"
    });
}
exports.default = default_1;
