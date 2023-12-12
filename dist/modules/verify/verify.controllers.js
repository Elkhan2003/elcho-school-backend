"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../plugins/prisma");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAadd1ebe9e29e73cb35becf6978bac987";
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSmsCodeVerify = async (req, res) => {
    const user = req.user;
    const { phone, traffic } = req.body;
    if (!user) {
        return res.status(401).send({
            message: "The user is not authenticated."
        });
    }
    const getUser = await prisma_1.prisma.user.findFirst({
        where: {
            id: user.id
        }
    });
    if (!getUser?.isPhoneVerified && phone) {
        try {
            const verifyUser = await prisma_1.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    phone: phone,
                    traffic: traffic || "unknown"
                }
            });
            const verification = await client.verify.v2
                .services(verifySid)
                .verifications.create({ to: phone, channel: "sms" });
            res.status(200).send({
                success: true,
                verifyStatus: verification.status,
                data: {
                    verifyUser
                }
            });
        }
        catch (err) {
            res.status(500).send({
                success: false,
                error: "Internal Server Error",
                details: `Backend function sendSmsCodeVerify: ${err}`
            });
        }
    }
    else {
        res.status(400).send({
            success: true,
            message: "You are already verified"
        });
    }
};
const checkSmsCodeVerify = async (req, res) => {
    const user = req.user;
    const { code } = req.body;
    if (!user) {
        return res.status(401).send({
            message: "The user is not authenticated."
        });
    }
    const getUser = await prisma_1.prisma.user.findFirst({
        where: {
            id: user.id
        }
    });
    try {
        const verificationCheck = await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: getUser?.phone, code: code });
        const { status, dateCreated, dateUpdated } = verificationCheck;
        if (status === "approved") {
            try {
                const verifyUser = await prisma_1.prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        isPhoneVerified: true
                    }
                });
                res.status(200).send({
                    success: true,
                    data: {
                        status,
                        dateCreated,
                        dateUpdated,
                        verifyUser
                    }
                });
            }
            catch (err) {
                res.status(500).send({
                    success: false,
                    error: "Internal Server Error",
                    details: `Backend function checkSmsCodeVerify: ${err}`
                });
            }
        }
    }
    catch (err) {
        res.status(500).send({
            success: false,
            error: "Invalid code",
            details: `Backend function checkSmsCodeVerify: ${err}`
        });
    }
};
exports.default = {
    sendSmsCodeVerify,
    checkSmsCodeVerify
};
