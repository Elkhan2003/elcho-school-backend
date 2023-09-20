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

const getProducts = async (req: FastifyRequest, res: FastifyReply) => {
  const productData = await req.server.prisma.product.findMany();

  if (productData.length > 0) {
    const products = productData.map((product) => ({
      id: product.id,
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      image: product.image || "",
      rating: {
        rate: product.rate || "",
        count: product.count || ""
      }
    }));

    res.status(200).send(products);
  } else {
    res.status(401).send({
      message: "No products found."
    });
  }
};


export default {
	sendProduct,
	getProducts
};
