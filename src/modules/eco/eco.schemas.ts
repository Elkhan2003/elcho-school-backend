import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

const sendProduct = {
	body: z.object({
		product: z.object({
			title: z.string(),
			price: z.string(),
			description: z.string(),
			category: z.string(),
			image: z.string(),
			rate: z.string(),
			count: z.string()
		})
	}),
	response: z.object({
		success: z.literal(true),
		data: z.any()
	})
};

const sendProductSchema = {
	response: {
		201: generateSchema(sendProduct.response)
	}
};

export default {
	sendProduct,
	sendProductSchema
};
