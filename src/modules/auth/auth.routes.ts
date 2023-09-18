import { FastifyInstance } from "fastify";
import authControllers from "./auth.controllers";

export default async function (app: FastifyInstance) {
	app.get("/login", authControllers.loginUser);

	app.get("/user", authControllers.getUser);

	app.get("/logout", authControllers.logoutUser);
}
