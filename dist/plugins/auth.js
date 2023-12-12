"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../plugins/prisma");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
exports.auth = (0, express_1.default)();
exports.auth.set("trust proxy", 1);
process.env.NODE_ENV === "development"
    ? exports.auth.use((0, express_session_1.default)({
        secret: fs_1.default
            .readFileSync(path_1.default.join(__dirname, "/../..", "secret-key"))
            .toString(),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 1
        },
        store: new prisma_session_store_1.PrismaSessionStore(prisma_1.prisma, {
            checkPeriod: 1 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        })
    }))
    : exports.auth.use((0, express_session_1.default)({
        secret: fs_1.default
            .readFileSync(path_1.default.join(__dirname, "/../..", "secret-key"))
            .toString(),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 1
        },
        store: new prisma_session_store_1.PrismaSessionStore(prisma_1.prisma, {
            checkPeriod: 1 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        })
    }));
exports.auth.use(passport_1.default.initialize());
exports.auth.use(passport_1.default.session());
// Google
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === "development"
        ? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
        : `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const profileData = await prisma_1.prisma.user.findFirst({
            where: { login: profile._json.email }
        });
        if (!profileData) {
            await prisma_1.prisma.user.create({
                data: {
                    auth: "Google",
                    firstName: profile._json.given_name || "",
                    lastName: profile._json.family_name || "",
                    login: profile._json.email,
                    password: "",
                    photo: profile._json.picture || ""
                }
            });
            const newUser = (await prisma_1.prisma.user.findFirst({
                where: { login: profile._json.email }
            }));
            return done(undefined, newUser);
        }
        else {
            return done(undefined, profileData);
        }
    }
    catch (err) {
        console.log(`${err}`);
    }
}));
// GitHub
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === "development"
        ? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/github`
        : `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/github`
}, async function (accessToken, refreshToken, profile, done) {
    try {
        const profileData = await prisma_1.prisma.user.findFirst({
            where: { login: profile._json.email || profile._json.login }
        });
        const userNameSplit = profile._json.name.split(" ");
        const firstName = userNameSplit[0];
        const lastName = userNameSplit[1];
        if (!profileData) {
            await prisma_1.prisma.user.create({
                data: {
                    auth: "GitHub",
                    firstName: firstName || "",
                    lastName: lastName || "",
                    login: profile._json.email || profile._json.login,
                    password: "",
                    photo: profile._json.avatar_url || ""
                }
            });
            const newUser = (await prisma_1.prisma.user.findFirst({
                where: { login: profile._json.email || profile._json.login }
            }));
            return done(undefined, newUser);
        }
        else {
            return done(undefined, profileData);
        }
        // return done(undefined, profile);
    }
    catch (err) {
        console.log(`${err}`);
    }
}));
passport_1.default.serializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});
exports.auth.get("/api/auth/callback/google", passport_1.default.authenticate("google", {
    successRedirect: process.env.NODE_ENV === "development"
        ? `${process.env.FRONTEND_BASE_URL_DEV}/`
        : `${process.env.FRONTEND_BASE_URL_PROD}/`,
    failureRedirect: process.env.NODE_ENV === "development"
        ? `${process.env.FRONTEND_BASE_URL_DEV}/login`
        : `${process.env.FRONTEND_BASE_URL_PROD}/login`
}));
exports.auth.get("/api/auth/callback/github", passport_1.default.authenticate("github", {
    successRedirect: process.env.NODE_ENV === "development"
        ? `${process.env.FRONTEND_BASE_URL_DEV}/`
        : `${process.env.FRONTEND_BASE_URL_PROD}/`,
    failureRedirect: process.env.NODE_ENV === "development"
        ? `${process.env.FRONTEND_BASE_URL_DEV}/login`
        : `${process.env.FRONTEND_BASE_URL_PROD}/login`
}));
