"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// import twilio from "twilio";
// const client = twilio(accountSid, authToken);
const sendSmsCodeVerify = async (req, res) => {
    const { user, phone } = req.body;
    if ((user.phone == null || user.phone !== phone) &&
        user.isPhoneVerified == false) {
        await req.server.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                phone: phone
            }
        });
    }
    else if (user.phone !== null && user.isPhoneVerified == false) {
        const verifiedUser = await req.server.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isPhoneVerified: true,
                phone: phone
            }
        });
        await res.status(200).send({
            success: true,
            data: {
                verifiedUser
            }
        });
    }
};
exports.default = {
    sendSmsCodeVerify
};
