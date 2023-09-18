import { FastifyInstance } from "fastify";
import { User } from "@prisma/client";
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
						path: "/",
						secure: true,
						sameSite: "none",
						domain: "muras-official.kg"
				  }
	});

	app.register(fastifyPassport.initialize());
	app.register(fastifyPassport.secureSession());
	app.register(fastifyAuth);

	fastifyPassport.registerUserSerializer(async (user, req) => {
		return user;
	});

	fastifyPassport.registerUserDeserializer(async (user, req) => {
		return user;
	});

	// ! Google Authenticator
	fastifyPassport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.NODE_ENV === "development"
						? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
						: `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`,
				passReqToCallback: true
			},
			async function (
				request: any,
				accessToken: any,
				refreshToken: any,
				profile: any,
				done: any
			) {
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
							} as User
						});

						const newUser = await app.prisma.user.findFirst({
							where: { email: profile._json.email }
						});
						return done(null, newUser);
					} else {
						return done(null, profileData);
					}
				} catch (err) {
					console.log(`${err}`);
				}
			}
		)
	);

	app.get(
		"/api/auth/callback/google",
		fastifyPassport.authenticate("google", {
			successRedirect:
				process.env.NODE_ENV === "development"
					? `${process.env.FRONTEND_BASE_URL_DEV}/`
					: `${process.env.FRONTEND_BASE_URL_PROD}/`,
			failureRedirect:
				process.env.NODE_ENV === "development"
					? `${process.env.FRONTEND_BASE_URL_DEV}/login`
					: `${process.env.FRONTEND_BASE_URL_PROD}/login`
		})
	);
};
export default fp(passport);
