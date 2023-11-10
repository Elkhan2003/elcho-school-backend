"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const loginUserGoogle = passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
});
const loginUserGitHub = passport_1.default.authenticate("github", {
    scope: ["user:email"]
});
const getUser = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send({
            message: "The user is not authenticated."
        });
    }
    res.status(200).send({
        success: true,
        user: user
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
    loginUserGoogle,
    loginUserGitHub,
    getUser,
    logoutUser
};
