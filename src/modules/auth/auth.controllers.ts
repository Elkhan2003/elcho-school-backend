import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { prisma, User } from "../../plugins/prisma";

const loginUser = passport.authenticate("google", {
	scope: ["profile", "email"]
});

const getUser = async (req: Request, res: Response) => {
	const user = req.user as User | undefined;

	if (!user) {
		return res.status(401).send({
			message: "The user is not authenticated."
		});
	}

	const profileData = await prisma.user.findFirst({
		where: { id: user.id }
	});

	res.status(200).send({
		success: true,
		user: profileData
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
	loginUser,
	getUser,
	logoutUser
};
