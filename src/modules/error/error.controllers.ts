import { RouteHandler } from "fastify";
import { z } from "zod";
import errorSchemas from "./error.schemas";

const sendError: RouteHandler<{
	Body: z.TypeOf<typeof errorSchemas.sendError.body>;
	Reply: z.TypeOf<typeof errorSchemas.sendError.response>;
}> = async (req, res) => {
	const { error } = req.body;

	await req.server.prisma.error.create({
		data: {
			code: error.code  || "",
			details: error.details || "",
			hint: error.hint  || "",
			message: error.message  || "",
		}
	});

	await res.status(200).send({
		success: true,
		data: error
	});
};

export default {
	sendError
};
