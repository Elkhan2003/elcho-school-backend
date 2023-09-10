import { FastifyInstance } from "fastify";
import verifyControllers from "./verify.controllers";
import verifySchemas from "./verify.schemas";

export default async function (app: FastifyInstance) {
	app.post<any>(
		"/send-sms",
		{
			schema: verifySchemas.sendSmsCodeVerificationSchema
		},
		verifyControllers.sendSmsCodeVerify
	);
}
