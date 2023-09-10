"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendError = async (req, res) => {
    const { error } = req.body;
    await req.server.prisma.error.create({
        data: {
            code: error.code || "",
            details: error.details || "",
            hint: error.hint || "",
            message: error.message || "",
        }
    });
    await res.status(200).send({
        success: true,
        data: error
    });
};
exports.default = {
    sendError
};
