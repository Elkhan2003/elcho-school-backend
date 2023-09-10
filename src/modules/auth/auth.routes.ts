import { FastifyInstance } from "fastify";
import authControllers from "./auth.controllers";
import authSchemas from "./auth.schemas";

export default async function (app: FastifyInstance) {
	app.post<any>(
		"/auth",
		{
			schema: authSchemas.authUserSchema
		},
		authControllers.authUser
	);
	app.post<any>(
		"/me",
		{
			schema: authSchemas.getMeSchema
		},
		authControllers.getMeData
	);
}
