import path from "path";
import fs from "fs";
import express from "express";
import { prisma, User } from "../plugins/prisma";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

export const auth = express();

auth.set("trust proxy", 1);

process.env.NODE_ENV === "development"
	? auth.use(
			session({
				secret: fs
					.readFileSync(path.join(__dirname, "/../..", "secret-key"))
					.toString(),
				resave: true,
				saveUninitialized: true,
				cookie: {
					sameSite: "lax",
					secure: false,
					maxAge: 1000 * 60 * 60 * 24 * 7
				}
			})
	  )
	: auth.use(
			session({
				secret: fs
					.readFileSync(path.join(__dirname, "/../..", "secret-key"))
					.toString(),
				resave: true,
				saveUninitialized: true,
				cookie: {
					sameSite: "none",
					secure: true,
					maxAge: 1000 * 60 * 60 * 24 * 7
				}
			})
	  );

auth.use(passport.initialize());
auth.use(passport.session());

// Google
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL:
				process.env.NODE_ENV === "development"
					? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/google`
					: `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/google`
		},
		async function (accessToken, refreshToken, profile, done) {
			try {
				const profileData = await prisma.user.findFirst({
					where: { login: profile._json.email }
				});
				if (!profileData) {
					await prisma.user.create({
						data: {
							auth: "Google",
							firstName: profile._json.given_name || "",
							lastName: profile._json.family_name || "",
							login: profile._json.email,
							password: "",
							photo: profile._json.picture || ""
						} as User
					});

					const newUser = (await prisma.user.findFirst({
						where: { login: profile._json.email }
					})) as User;
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

// GitHub
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL:
				process.env.NODE_ENV === "development"
					? `${process.env.BACKEND_BASE_URL_DEV}/api/auth/callback/github`
					: `${process.env.BACKEND_BASE_URL_PROD}/api/auth/callback/github`
		},
		async function (
			accessToken: any,
			refreshToken: any,
			profile: any,
			done: any
		) {
			try {
				const profileData = await prisma.user.findFirst({
					where: { login: profile._json.email || profile._json.login }
				});
				const userNameSplit = profile._json.name.split(" ");
				const firstName = userNameSplit[0];
				const lastName = userNameSplit[1];
				if (!profileData) {
					await prisma.user.create({
						data: {
							auth: "GitHub",
							firstName: firstName || "",
							lastName: lastName || "",
							login: profile._json.email || profile._json.login,
							password: "",
							photo: profile._json.avatar_url || ""
						} as User
					});
					const newUser = (await prisma.user.findFirst({
						where: { login: profile._json.email || profile._json.login }
					})) as User;
					return done(undefined, newUser);
				} else {
					return done(undefined, profileData);
				}
				// return done(undefined, profile);
			} catch (err) {
				console.log(`${err}`);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	return done(null, user);
});

passport.deserializeUser((user: User, done) => {
	return done(null, user);
});

auth.get(
	"/api/auth/callback/google",
	passport.authenticate("google", {
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

auth.get(
	"/api/auth/callback/github",
	passport.authenticate("github", {
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
