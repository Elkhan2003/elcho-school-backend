import { FastifySchema } from "fastify";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

const authUser = {
	body: z.object({
		user: z.object({
			firstName: z.string(),
			lastName: z.string(),
			email: z.string(),
			photo: z.string(),
			phone: z.string(),
			traffic: z.string().optional()
		}),
	}),
	response: z.object({
		success: z.literal(true),
		data: z.any()
	})
};

const authUserSchema = {
	response: {
		201: generateSchema(authUser.response)
	}
};

const getMe = {
	body: z.object({
		user: z.object({
			id: z.number(),
			firstName: z.string(),
			lastName: z.string(),
			role: z.string(),
			email: z.string(),
			password: z.string(),
			isActive: z.string(),
			createdAt: z.string(),
			updatedAt: z.string(),
			photo: z.string(),
			isPhoneVerified: z.boolean(),
			phone: z.string(),
			traffic: z.string()
		})
	}),
	response: z.object({
		success: z.literal(true),
		data: z.any()
	})
};

const getMeSchema: FastifySchema = {
	response: {
		200: generateSchema(getMe.response)
	}
};

export default {
	authUser,
	authUserSchema,
	getMe,
	getMeSchema
};
