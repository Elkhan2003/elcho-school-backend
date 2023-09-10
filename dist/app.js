"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const index_1 = __importDefault(require("./routes/index"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const buildServer = () => {
    const server = (0, fastify_1.default)({
        logger: false
    });
    server.register(cors_1.default, {
        origin: [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5000",
            "https://muras.vercel.app"
        ],
        credentials: true
    });
    server.register(prisma_1.default);
    server.get("/", (req, res) => {
        res.status(200).send({
            message: "Hello World!"
        });
    });
    server.register(index_1.default, {
        prefix: "/api/v1"
    });
    return server;
};
exports.buildServer = buildServer;
