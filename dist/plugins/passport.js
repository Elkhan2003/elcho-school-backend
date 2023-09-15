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
                path: "/"
                // secure: true,
                // sameSite: "none",
                // domain: "muras.vercel.app"
            }
    });
    app.register(passport_1.default.initialize());
    app.register(passport_1.default.secureSession());
    app.register(auth_1.default);
    // ! Google Authenticator
    passport_1.default.use(new passport_google_oauth2_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "development"
            ? `${process.env.BACKEND_BASE_URL_DEV}/api/v1/auth/google/callback`
            : `${process.env.BACKEND_BASE_URL_PROD}/api/v1/auth/google/callback`,
        passReqToCallback: true
    }, async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile._json);
        await authUserToSupabase(profile._json.given_name, profile._json.family_name, profile._json.email, profile._json.picture, app.prisma);
        done(null, profile);
    }));
    passport_1.default.registerUserSerializer(async (user, req) => {
        return user;
    });
    passport_1.default.registerUserDeserializer(async (user, req) => {
        return user;
    });
};
exports.default = (0, fastify_plugin_1.default)(passport);
// authentication user
const authUserToSupabase = async (first_name, last_name, email, photo, prisma) => {
    try {
        const authUser = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!authUser) {
            await prisma.user.create({
                data: {
                    firstName: first_name || "",
                    lastName: last_name || "",
                    email: email,
                    password: "",
                    photo: photo
                }
            });
        }
    }
    catch (err) {
        console.log(`${err}`);
    }
};
