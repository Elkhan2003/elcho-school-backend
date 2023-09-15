import { FastifyInstance } from "fastify";
import { PrismaClient, User } from "@prisma/client";
import fp from "fastify-plugin";
import path from "path";
import fs from "fs";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import fastifyAuth from "@fastify/auth";
// @ts-ignore
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const passport = async (app: FastifyInstance) => {
	app.register(fastifySecureSession, {
		key: fs.readFileSync(path.join(__dirname, "/../..", "secret-key")),
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

	app.register(fastifyPassport.initialize());
	app.register(fastifyPassport.secureSession());
	app.register(fastifyAuth);

	// ! Google Authenticator
	fastifyPassport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.NODE_ENV === "development"
						? `${process.env.BACKEND_BASE_URL_DEV}/api/v1/auth/google/callback`
						: `${process.env.BACKEND_BASE_URL_PROD}/api/v1/auth/google/callback`,
				passReqToCallback: true
			},
			async function (
				request: any,
				accessToken: any,
				refreshToken: any,
				profile: any,
				done: any
			) {
				console.log(profile._json);
				await authUserToSupabase(
					profile._json.given_name,
					profile._json.family_name,
					profile._json.email,
					profile._json.picture,
					app.prisma
				);
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
};
export default fp(passport);

// authentication user
const authUserToSupabase = async (
	first_name: string,
	last_name: string,
	email: string,
	photo: string,
	prisma: PrismaClient
) => {
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
				} as User
			});
		}
	} catch (err) {
		console.log(`${err}`);
	}
};
