"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("@anatine/zod-openapi");
const zod_1 = require("zod");
const sendError = {
    body: zod_1.z.object({
        error: zod_1.z.object({
            code: zod_1.z.string(),
            details: zod_1.z.string(),
            hint: zod_1.z.string(),
            message: zod_1.z.string()
        })
    }),
    response: zod_1.z.object({
        success: zod_1.z.literal(true),
        data: zod_1.z.any()
    })
};
const sendErrorSchema = {
    response: {
        201: (0, zod_openapi_1.generateSchema)(sendError.response)
    }
};
exports.default = {
    sendError,
    sendErrorSchema
};
