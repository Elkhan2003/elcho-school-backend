"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// import twilio from "twilio";
// const client = twilio(accountSid, authToken);
const sendSmsCodeVerify = async (req, res) => {
    const { user } = req.body;
    const isPhoneVerified = user.isPhoneVerified;
    if (!isPhoneVerified && user.phone) {
        await req.server.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                phone: user.phone,
                isPhoneVerified: !isPhoneVerified
            }
        });
    }
    const verifiedUser = await req.server.prisma.user.findUnique({
        where: {
            id: user.id
        }
    });
    await res.status(200).send({
        success: true,
        data: {
            verifiedUser
        }
    });
};
exports.default = {
    sendSmsCodeVerify
};
