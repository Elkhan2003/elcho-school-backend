import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

const sendSmsCodeVerification = {
	body: z.object({
		user: z.object({
			id: z.number(),
			isPhoneVerified: z.boolean(),
			phone: z.string(),
		}),
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
