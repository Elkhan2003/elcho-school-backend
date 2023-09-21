"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../plugins/prisma");
const sendError = async (req, res) => {
    const { error } = req.body;
    await prisma_1.prisma.error.create({
        data: {
            code: error.code || "",
            details: error.details || "",
            hint: error.hint || "",
            message: error.message || ""
        }
    });
    res.status(200).send({
        success: true,
        data: error
    });
};
exports.default = {
    sendError
};
