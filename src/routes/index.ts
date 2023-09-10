import { FastifyInstance } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import verifyRoutes from "../modules/verify/verify.routes";
import errorRoutes from "../modules/error/error.routes";

export default async function (app: FastifyInstance) {
	app.register(authRoutes, {
		prefix: "/"
	});
	app.register(verifyRoutes, {
		prefix: "/"
	});
	app.register(errorRoutes, {
		prefix: "/"
	});
}
