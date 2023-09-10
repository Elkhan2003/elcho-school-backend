import { config } from "dotenv";
config();
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import routes from "./routes/index";
import prisma from "./plugins/prisma";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
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
			"https://muras.vercel.app",
			"https://muras-test.netlify.app"
		],
		credentials: true
	});

	server.register(prisma);

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
