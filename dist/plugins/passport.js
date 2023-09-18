"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const secure_session_1 = __importDefault(require("@fastify/secure-session"));
const passport_1 = __importDefault(require("@fastify/passport"));
const auth_1 = __importDefault(require("@fastify/auth"));
// @ts-ignore
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport = async (app) => {
    app.register(secure_session_1.default, {
        key: fs_1.default.readFileSync(path_1.default.join(__dirname, "/../..", "secret-key")),
        logLevel: "debug",
        cookie: process.env.NODE_ENV === "development"
            ? {
                path: "/"
            }
            : {
                path: "/",
                secure: true,
                sameSite: "none",
                domain: "muras-official.kg"
            }
    });
    app.register(passport_1.default.initialize());
    app.register(passport_1.default.secureSession());
    app.register(auth_1.default);
    passport_1.default.registerUserSerializer(async (user, req) => {
        return user;
    });
    passport_1.default.registerUserDeserializer(async (user, req) => {
        return user;
    });
    // ! Google Authenticator
    passport_1.default.use(new passport_google_oauth2_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "development"
            ? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
            : `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`,
        passReqToCallback: true
    }, async function (request, accessToken, refreshToken, profile, done) {
        try {
            const profileData = await app.prisma.user.findFirst({
                where: { email: profile._json.email }
            });
            if (!profileData) {
                await app.prisma.user.create({
                    data: {
                        firstName: profile._json.given_name || "",
                        lastName: profile._json.family_name || "",
                        email: profile._json.email,
                        password: "",
                        photo: profile._json.picture
                    }
                });
                const newUser = await app.prisma.user.findFirst({
                    where: { email: profile._json.email }
                });
                return done(null, newUser);
            }
            else {
                return done(null, profileData);
            }
        }
        catch (err) {
            console.log(`${err}`);
        }
    }));
    app.get("/api/auth/callback/google", passport_1.default.authenticate("google", {
        successRedirect: process.env.NODE_ENV === "development"
            ? `${process.env.FRONTEND_BASE_URL_DEV}/`
            : `${process.env.FRONTEND_BASE_URL_PROD}/`,
        failureRedirect: process.env.NODE_ENV === "development"
            ? `${process.env.FRONTEND_BASE_URL_DEV}/login`
            : `${process.env.FRONTEND_BASE_URL_PROD}/login`
    }));
};
exports.default = (0, fastify_plugin_1.default)(passport);
