import { FastifyRequest, FastifyReply } from "fastify";
import fastifyPassport from "@fastify/passport";

const loginUser = fastifyPassport.authenticate("google", {
	scope: ["profile", "email"]
});

const getUser = async (req: FastifyRequest, res: FastifyReply) => {
	const user = req.user!;

	const profileData = await req.server.prisma.user.findFirst({
		where: { id: user.id }
	});

	if (profileData) {
		res.status(200).send({
			success: true,
			user: profileData
		});
	} else {
		res.status(401).send({
			message: "The user is not authenticated."
		});
	}
};

const logoutUser = (req: FastifyRequest, res: FastifyReply) => {
	req.logout();
	res.redirect(
		process.env.NODE_ENV === "development"
			? process.env.FRONTEND_BASE_URL_DEV!
			: process.env.FRONTEND_BASE_URL_PROD!
	);
};

export default {
	loginUser,
	getUser,
	logoutUser
};
