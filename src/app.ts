import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { User } from "./plugins/prisma";
import { auth } from "./plugins/auth";

export const buildServer = () => {
	const server = express();

	// Middleware
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(
		cors({
			origin: [
				"http://localhost:3000",
				"http://localhost:5000",
				"http://127.0.0.1:3000",
				"http://127.0.0.1:5000",
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:5175",
				"http://localhost:5176",
				"http://localhost:5177",
				"http://localhost:5178",
				"http://localhost:5179",
				"http://localhost:5180",
				"https://muras-auth-test.vercel.app",
				"https://muras-official.kg",
				"https://iskender911.vercel.app"
			],
			credentials: true
		})
	);

	// server.use(cors());

	server.use(auth);

	server.get("/", (req, res) => {
		const user = req.user as User;
		res.status(200).send({
			message: "Hello World!",
			user: user || "The user is not authenticated"
		});
	});

	server.use("/api/v1", routes);

	return server;
};
