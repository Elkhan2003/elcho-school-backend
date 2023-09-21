"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const prisma_1 = require("../../plugins/prisma");
const loginUser = passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
});
const getUser = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send({
            message: "The user is not authenticated."
        });
    }
    const profileData = await prisma_1.prisma.user.findFirst({
        where: { id: user.id }
    });
    res.status(200).send({
        success: true,
        user: profileData
    });
};
const logoutUser = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.NODE_ENV === "development"
            ? process.env.FRONTEND_BASE_URL_DEV
            : process.env.FRONTEND_BASE_URL_PROD);
    });
};
exports.default = {
    loginUser,
    getUser,
    logoutUser
};
