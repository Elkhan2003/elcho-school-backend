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

	app.get("/login", authControllers.loginUser);

	app.get("/user", authControllers.getUser);

	app.get("/logout", authControllers.logoutUser);

	app.get("/auth/google/callback", authControllers.authGoogleCallback);
}
