"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// import twilio from "twilio";
// const client = twilio(accountSid, authToken);
const sendSmsCodeVerify = async (req, res) => {
    const user = req.user;
    const { phone, traffic } = req.body;
    if (!user.isPhoneVerified && phone) {
        await req.server.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                phone: phone,
                isPhoneVerified: !user.isPhoneVerified,
                traffic: traffic || "unknown"
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
