import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import routes from "./routes/index";

export const buildServer = () => {
	const server = express();

	// Middleware
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	// server.use(
	// 	cors({
	// 		origin: [
	// 			"http://localhost:3000",
	// 			"http://localhost:5000",
	// 			"http://127.0.0.1:3000",
	// 			"http://127.0.0.1:5000",
	// 			"http://localhost:5173",
	// 			"https://muras-auth-test.vercel.app",
	// 			"https://muras-official.kg"
	// 		],
	// 		credentials: true
	// 	})
	// );

	server.use(cors());

	server.get("/", (req, res) => {
		res.status(200).send({
			message: "Hello World!"
		});
	});

	server.use("/api/v1", routes);

	return server;
};
