"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controllers_1 = __importDefault(require("./auth.controllers"));
const auth_schemas_1 = __importDefault(require("./auth.schemas"));
async function default_1(app) {
    app.post("/auth", {
        schema: auth_schemas_1.default.authUserSchema
    }, auth_controllers_1.default.authUser);
    app.post("/me", {
        schema: auth_schemas_1.default.getMeSchema
    }, auth_controllers_1.default.getMeData);
}
exports.default = default_1;
