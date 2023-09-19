"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("@fastify/passport"));
const loginUser = passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
});
const getUser = async (req, res) => {
    const user = req.user;
    const profileData = await req.server.prisma.user.findFirst({
        where: { id: user.id }
    });
    if (profileData) {
        res.status(200).send({
            success: true,
            user: profileData
        });
    }
    else {
        res.status(401).send({
            message: "The user is not authenticated."
        });
    }
};
const logoutUser = (req, res) => {
    req.logout();
    res.redirect(process.env.NODE_ENV === "development"
        ? process.env.FRONTEND_BASE_URL_DEV
        : process.env.FRONTEND_BASE_URL_PROD);
};
exports.default = {
    loginUser,
    getUser,
    logoutUser
};
