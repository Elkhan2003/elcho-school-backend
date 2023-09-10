"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_controllers_1 = __importDefault(require("./error.controllers"));
const error_schemas_1 = __importDefault(require("./error.schemas"));
async function default_1(app) {
    app.post("/error", {
        schema: error_schemas_1.default.sendErrorSchema
    }, error_controllers_1.default.sendError);
}
exports.default = default_1;
