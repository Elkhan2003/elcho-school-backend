import { Request, Response, NextFunction } from "express";
import passport from "passport";

const loginUserGoogle = passport.authenticate("google", {
	scope: ["profile", "email"]
});

const loginUserGitHub = passport.authenticate("github", {
	scope: ["user:email"]
});

const getUser = async (req: Request, res: Response) => {
	const user = req.user;

	if (!user) {
		return res.status(401).send({
			message: "The user is not authenticated."
		});
	}

	res.status(200).send({
		success: true,
		user: user
	});
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect(
			process.env.NODE_ENV === "development"
				? process.env.FRONTEND_BASE_URL_DEV!
				: process.env.FRONTEND_BASE_URL_PROD!
		);
	});
};

export default {
	loginUserGoogle,
	loginUserGitHub,
	getUser,
	logoutUser
};
