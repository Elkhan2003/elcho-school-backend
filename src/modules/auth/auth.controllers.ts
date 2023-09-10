import { User } from "@prisma/client";
import { RouteHandler } from "fastify";
import { z } from "zod";
import authSchemas from "./auth.schemas";
import { PrismaClient } from "@prisma/client";

const authUser: RouteHandler<{
	Body: z.TypeOf<typeof authSchemas.authUser.body>;
	Reply: z.TypeOf<typeof authSchemas.authUser.response>;
}> = async (req, res) => {
	const { user } = req.body;
	const prisma = req.server.prisma;

	await authUserToSupabase(
		user.firstName,
		user.lastName,
		user.photo,
		user.email,
		user.traffic,
		prisma
	);

	console.log("Successfully authorization 🚀");
	return res.status(200).send({
		success: true,
		data: req.body
	});
};

// authentication user
const authUserToSupabase = async (
	first_name: string,
	last_name: string,
	photo: string,
	email: string,
	traffic: string | undefined,
	prisma: PrismaClient
) => {
	try {
		const authUser = await prisma.user.findFirst({
			where: { email: email }
		});
		if (!authUser) {
			await prisma.user.create({
				data: {
					firstName: first_name,
					lastName: last_name,
					email: email,
					password: "",
					photo: photo,
					traffic: traffic
				} as User
			});
		}
	} catch (err) {
		console.log(`${err}`);
	}
};

const getMeData: RouteHandler<{
	Body: z.TypeOf<typeof authSchemas.getMe.body>;
	Reply: z.TypeOf<typeof authSchemas.getMe.response>;
}> = async (req, res) => {
	const { user } = req.body;

	const authUserData = await req.server.prisma.user.findFirst({
		where: { id: user.id }
	});

	return res.status(200).send({
		success: true,
		data: authUserData
	});
};

export default { authUser, getMeData };
