"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const secure_session_1 = __importDefault(require("@fastify/secure-session"));
const passport_1 = __importDefault(require("@fastify/passport"));
const auth_1 = __importDefault(require("@fastify/auth"));
// @ts-ignore
const passport_google_oauth2_1 = require("passport-google-oauth2");
const index_1 = __importDefault(require("./routes/index"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const buildServer = () => {
    const server = (0, fastify_1.default)({
        logger: false
    });
    server.register(cors_1.default, {
        origin: [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5000",
            "https://muras.vercel.app",
            "https://muras-test.netlify.app",
            "https://muras-backend-f4e607bd17df.herokuapp.com"
        ],
        credentials: true
    });
    server.register(secure_session_1.default, {
        key: fs_1.default.readFileSync(path_1.default.join(__dirname, "/..", "secret-key")),
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
    server.register(passport_1.default.initialize());
    server.register(passport_1.default.secureSession());
    server.register(auth_1.default);
    server.register(prisma_1.default);
    server.get("/", (req, res) => {
        res.status(200).send({
            message: "Hello World!",
            //@ts-ignore
            user: req.user?.displayName
        });
    });
    // ! Google Authenticator
    passport_1.default.use(new passport_google_oauth2_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "development"
            ? `${process.env.BACKEND_BASE_URL_DEV}/auth/google/callback`
            : `${process.env.BACKEND_BASE_URL_PROD}/auth/google/callback`,
        passReqToCallback: true
    }, async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile);
        // const authUser = await server.prisma.user.findFirst({
        // 	where: { email: profile.emails }
        // });
        // console.log(authUser);
        done(null, profile);
    }));
    passport_1.default.registerUserSerializer(async (user, req) => {
        return user;
    });
    passport_1.default.registerUserDeserializer(async (user, req) => {
        return user;
    });
    server.get("/login", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
    server.get("/user", (req, res) => {
        res.status(200).send({
            user: req.user
        });
    });
    server.get("/logout", (req, res) => {
        req.logout();
        res.redirect(process.env.NODE_ENV === "development"
            ? process.env.REDIRECT_URL_DEV
            : process.env.REDIRECT_URL_PROD);
    });
    server.get("/auth/google/callback", passport_1.default.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/auth/google/failure"
    }));
    server.register(index_1.default, {
        prefix: "/api/v1"
    });
    return server;
};
exports.buildServer = buildServer;
