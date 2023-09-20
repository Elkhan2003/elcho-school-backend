import { RouteHandler } from "fastify";
import { z } from "zod";
import productSchemas from "./eco.schemas";
import { FastifyRequest, FastifyReply } from "fastify";

const sendProduct: RouteHandler<{
	Body: z.TypeOf<typeof productSchemas.sendProduct.body>;
	Reply: z.TypeOf<typeof productSchemas.sendProduct.response>;
}> = async (req, res) => {
	const { product } = req.body;

	await req.server.prisma.product.create({
		data: {
			title: product.title || "",
			price: product.price || "",
			description: product.description || "",
			category: product.category || "",
			image: product.image || "",
			rate: product.rate || "",
			count: product.count || ""
		}
	});

	await res.status(200).send({
		success: true,
		data: product
	});
};

const getProduct = async (req: FastifyRequest, res: FastifyReply) => {
	const productData = await req.server.prisma.product.findMany();

	if (productData.length > 0) {
		const firstProduct = productData[0];

		res.status(200).send({
			id: firstProduct.id,
			title: firstProduct.title || "",
			price: firstProduct.price || "",
			description: firstProduct.description || "",
			category: firstProduct.category || "",
			image: firstProduct.image || "",
			rating: {
				rate: firstProduct.rate || "",
				count: firstProduct.count || ""
			}
		});
	} else {
		res.status(401).send({
			message: "The user is not authenticated."
		});
	}
};

export default {
	sendProduct,
	getProduct
};
