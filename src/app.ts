import { config } from "dotenv";
config();
import path from "path";
import fs from "fs";
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import fastifyAuth from "@fastify/auth";
// @ts-ignore
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import routes from "./routes/index";
import prisma from "./plugins/prisma";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

export const buildServer = () => {
	const server: FastifyInstance = fastify({
		logger: false
	});

	server.register(fastifyCors, {
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

	server.register(fastifySecureSession, {
		key: fs.readFileSync(path.join(__dirname, "/..", "secret-key")),
		logLevel: "debug",

		cookie:
			process.env.NODE_ENV === "development"
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

	server.register(fastifyPassport.initialize());
	server.register(fastifyPassport.secureSession());
	server.register(fastifyAuth);
	server.register(prisma);

	server.get("/", (req, res) => {
		res.status(200).send({
			message: "Hello World!",
			//@ts-ignore
			user: req.user?.displayName
		});
	});

	// ! Google Authenticator
	fastifyPassport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.NODE_ENV === "development"
						? `${process.env.BACKEND_BASE_URL_DEV}/auth/google/callback`
						: `${process.env.BACKEND_BASE_URL_PROD}/auth/google/callback`,
				passReqToCallback: true
			},
			async function (
				request: any,
				accessToken: any,
				refreshToken: any,
				profile: any,
				done: any
			) {
				console.log(profile);
				done(null, profile);
			}
		)
	);

	fastifyPassport.registerUserSerializer(async (user, req) => {
		return user;
	});

	fastifyPassport.registerUserDeserializer(async (user, req) => {
		return user;
	});

	server.get(
		"/login",
		fastifyPassport.authenticate("google", { scope: ["email", "profile"] })
	);

	server.get("/logout", (req, res) => {
		req.logout();
		res.redirect(
			process.env.NODE_ENV === "development"
				? process.env.REDIRECT_URL_DEV!
				: process.env.REDIRECT_URL_PROD!
		);
	});

	server.get(
		"/auth/google/callback",
		fastifyPassport.authenticate("google", {
			successRedirect: "/",
			failureRedirect: "/auth/google/failure"
		})
	);

	server.register(routes, {
		prefix: "/api/v1"
	});

	return server;
};
