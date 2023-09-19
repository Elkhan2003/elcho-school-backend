import { FastifyInstance } from "fastify";
import { User } from "@prisma/client";
import fp from "fastify-plugin";
import path from "path";
import fs from "fs";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
// @ts-ignore
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const passport = async (app: FastifyInstance) => {
	app.register(fastifySecureSession, {
		key: fs.readFileSync(path.join(__dirname, "/../..", "secret-key")),
		cookie: {
			path: "/"
		}
	});

	app.register(fastifyPassport.initialize());
	app.register(fastifyPassport.secureSession());

	// ! Google Authenticator
	fastifyPassport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL:
					process.env.NODE_ENV === "development"
						? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
						: `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`
			},
			async function (
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
						return done(undefined, newUser);
					} else {
						return done(undefined, profileData);
					}
				} catch (err) {
					console.log(`${err}`);
				}
			}
		)
	);

	fastifyPassport.registerUserSerializer(async (user, req) => {
		return user;
	});

	fastifyPassport.registerUserDeserializer(async (user, req) => {
		return user;
	});

	app.get(
		"/api/auth/callback/google",
		{
			preValidation: fastifyPassport.authenticate("google", {
				scope: ["profile", "email"]
			})
		},
		async (req, res) => {
			res.redirect(
				process.env.NODE_ENV === "development"
					? `${process.env.FRONTEND_BASE_URL_DEV}/`
					: `${process.env.FRONTEND_BASE_URL_PROD}/`
			);
		}
	);
};
export default fp(passport);
