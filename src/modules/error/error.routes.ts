import { FastifyInstance } from "fastify";
import errorControllers from "./error.controllers";
import errorSchemas from "./error.schemas";

export default async function (app: FastifyInstance) {
	app.post<any>(
		"/error",
		{
			schema: errorSchemas.sendErrorSchema
		},
		errorControllers.sendError
	);
}
