import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

const sendError = {
	body: z.object({
		error: z.object({
			code: z.string(),
			details: z.string(),
			hint: z.string(),
			message: z.string()
		})
	}),
	response: z.object({
		success: z.literal(true),
		data: z.any()
	})
};

const sendErrorSchema = {
	response: {
		201: generateSchema(sendError.response)
	}
};

export default {
	sendError,
	sendErrorSchema
};
