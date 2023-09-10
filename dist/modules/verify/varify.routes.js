"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verify_controllers_1 = __importDefault(require("./verify.controllers"));
const verify_schemas_1 = __importDefault(require("./verify.schemas"));
async function default_1(app) {
    app.post("/send-sms", {
        schema: verify_schemas_1.default.sendSmsCodeVerificationSchema
    }, verify_controllers_1.default.sendSmsCodeVerify);
}
exports.default = default_1;
