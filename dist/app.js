"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const buildServer = () => {
    const server = (0, express_1.default)();
    // Middleware
    server.use(express_1.default.urlencoded({ extended: true }));
    server.use(express_1.default.json());
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
    server.use((0, cors_1.default)());
    server.get("/", (req, res) => {
        res.status(200).send({
            message: "Hello World!"
        });
    });
    server.use("/api/v1", index_1.default);
    return server;
};
exports.buildServer = buildServer;
