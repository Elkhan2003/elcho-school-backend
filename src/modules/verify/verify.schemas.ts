import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

const sendSmsCodeVerification = {
	body: z.object({
		phone: z.string(),
		traffic: z.string().optional()
	}),
	response: z.object({
		success: z.literal(true),
		data: z.any()
	})
};

const sendSmsCodeVerificationSchema = {
	response: {
		201: generateSchema(sendSmsCodeVerification.response)
	}
};

export default {
	sendSmsCodeVerification,
	sendSmsCodeVerificationSchema
};
