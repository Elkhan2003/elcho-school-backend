import { config } from "dotenv";
config();
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import routes from "./routes/index";
import prisma from "./plugins/prisma";
import { PrismaClient, User } from "@prisma/client";
import passport from "./plugins/passport";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
	interface PassportUser extends User {}
}

export const buildServer = () => {
	const server: FastifyInstance = fastify({
		logger: false
	});

	server.register(fastifyCors, {
		origin: [
			"http://localhost:3000",
			"http://localhost:5000",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5000",
			"http://localhost:5173",
			"https://muras.vercel.app",
			"https://muras-test.netlify.app",
			"https://muras-backend-f4e607bd17df.herokuapp.com",
			"https://muras-official.kg"
		],
		credentials: true
	});

	server.register(prisma);
	server.register(passport);

	server.get("/", (req, res) => {
		res.status(200).send({
			message: "Hello World!"
		});
	});

	server.register(routes, {
		prefix: "/api/v1"
	});

	return server;
};
