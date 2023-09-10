import { buildServer } from "./app";

const server = buildServer();

const start = async () => {
	const PORT: any = process.env.PORT || 3000;

	try {
		const address = await server.listen({
			port: PORT,
			host: "0.0.0.0"
		});

		console.log(`${new Date()}`);
		console.log("server running at: " + address);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();
