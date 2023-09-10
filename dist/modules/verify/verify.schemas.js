"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("@anatine/zod-openapi");
const zod_1 = require("zod");
const sendSmsCodeVerification = {
    body: zod_1.z.object({
        user: zod_1.z.object({
            id: zod_1.z.number(),
            isPhoneVerified: zod_1.z.boolean(),
            phone: zod_1.z.string(),
        }),
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
