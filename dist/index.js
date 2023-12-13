"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TZ = "UTC+6";
const app_1 = require("./app");
const server = (0, app_1.buildServer)();
const start = async () => {
    const PORT = process.env.PORT || 3000;
    try {
        server.listen({
            port: PORT,
            host: "0.0.0.0"
        });
        console.log(`${new Date()}`);
        console.log("server running at: http://localhost:" + PORT);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
