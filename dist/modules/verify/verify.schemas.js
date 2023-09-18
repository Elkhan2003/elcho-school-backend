"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("@anatine/zod-openapi");
const zod_1 = require("zod");
const sendSmsCodeVerification = {
    body: zod_1.z.object({
        phone: zod_1.z.string(),
        traffic: zod_1.z.string().optional()
    }),
    response: zod_1.z.object({
        success: zod_1.z.literal(true),
        data: zod_1.z.any()
    })
};
const sendSmsCodeVerificationSchema = {
    response: {
        201: (0, zod_openapi_1.generateSchema)(sendSmsCodeVerification.response)
    }
};
exports.default = {
    sendSmsCodeVerification,
    sendSmsCodeVerificationSchema
};
