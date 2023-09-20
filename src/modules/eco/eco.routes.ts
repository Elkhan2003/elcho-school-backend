import { FastifyInstance } from "fastify";
import productControllers from "./eco.controllers";
import productSchemas from "./eco.schemas";

export default async function (app: FastifyInstance) {
	app.post<any>(
		"/send-product",
		{
			schema: productSchemas.sendProductSchema
		},
		productControllers.sendProduct
	);
	app.get<any>("/get-product", productControllers.getProduct);
}
