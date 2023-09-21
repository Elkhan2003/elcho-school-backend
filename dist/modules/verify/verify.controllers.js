"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../plugins/prisma");
const sendSmsCodeVerify = async (req, res) => {
    const user = req.user;
    const { phone, traffic } = req.body;
    if (!user.isPhoneVerified && phone) {
        const verifyUser = await prisma_1.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                phone: phone,
                isPhoneVerified: !user.isPhoneVerified,
                traffic: traffic || "unknown"
            }
        });
        res.status(200).send({
            success: true,
            data: {
                verifyUser
            }
        });
    }
};
exports.default = {
    sendSmsCodeVerify
};
