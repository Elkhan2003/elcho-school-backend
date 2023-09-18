"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("@anatine/zod-openapi");
const zod_1 = require("zod");
const authUser = {
    body: zod_1.z.object({
        user: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
            email: zod_1.z.string(),
            photo: zod_1.z.string(),
            phone: zod_1.z.string(),
            traffic: zod_1.z.string().optional()
        })
    }),
    response: zod_1.z.object({
        success: zod_1.z.boolean().optional(),
        data: zod_1.z.any(),
        message: zod_1.z.any()
    })
};
const authUserSchema = {
    response: {
        201: (0, zod_openapi_1.generateSchema)(authUser.response)
    }
};
const getMe = {
    body: zod_1.z.object({
        user: zod_1.z.object({
            id: zod_1.z.number(),
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
            role: zod_1.z.string(),
            email: zod_1.z.string(),
            password: zod_1.z.string(),
            isActive: zod_1.z.string(),
            createdAt: zod_1.z.string(),
            updatedAt: zod_1.z.string(),
            photo: zod_1.z.string(),
            isPhoneVerified: zod_1.z.boolean(),
            phone: zod_1.z.string(),
            traffic: zod_1.z.string()
        })
    }),
    response: zod_1.z.object({
        success: zod_1.z.boolean().optional(),
        data: zod_1.z.any(),
        message: zod_1.z.any()
    })
};
const getMeSchema = {
    response: {
        200: (0, zod_openapi_1.generateSchema)(getMe.response)
    }
};
exports.default = {
    authUser,
    authUserSchema,
    getMe,
    getMeSchema
};
