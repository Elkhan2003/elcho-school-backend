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
// @ts-ignore
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport = async (app) => {
    app.register(secure_session_1.default, {
        key: fs_1.default.readFileSync(path_1.default.join(__dirname, "/../..", "secret-key")),
        cookie: {
            path: "/"
        }
    });
    app.register(passport_1.default.initialize());
    app.register(passport_1.default.secureSession());
    // ! Google Authenticator
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "development"
            ? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
            : `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`
    }, async function (accessToken, refreshToken, profile, done) {
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
    passport_1.default.registerUserSerializer(async (user, req) => {
        return user;
    });
    passport_1.default.registerUserDeserializer(async (user, req) => {
        return user;
    });
    app.get("/api/auth/callback/google", {
        preValidation: passport_1.default.authenticate("google", {
            scope: ["profile", "email"]
        })
    }, async (req, res) => {
        res.redirect(process.env.NODE_ENV === "development"
            ? `${process.env.FRONTEND_BASE_URL_DEV}/`
            : `${process.env.FRONTEND_BASE_URL_PROD}/`);
    });
};
exports.default = (0, fastify_plugin_1.default)(passport);
