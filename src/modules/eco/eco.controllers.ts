import { Request, Response } from "express";
import { prisma } from "../../plugins/prisma";

interface ProductType {
	author: string;
	title: string;
	price: string;
	description: string;
	category: string;
	image: string;
	rate: string;
	count: string;
}

const sendProduct = async (req: Request, res: Response) => {
	const { product }: { product: ProductType } = req.body;

	if (!product) {
		return res.status(400).send({
			success: false,
			error: "Product information is missing in the request body."
		});
	}

	await prisma.product.create({
		data: {
			author: product.author || "",
			title: product.title || "",
			price: product.price || "",
			description: product.description || "",
			category: product.category || "",
			image: product.image || "",
			rate: product.rate || "",
			count: product.count || ""
		}
	});

	res.status(200).send({
		success: true,
		data: product
	});
};

const getProducts = async (req: Request, res: Response) => {
	const productData = await prisma.product.findMany();

	if (productData.length > 0) {
		const products = productData.map((product) => ({
			id: product.id,
			author: product.author || "",
			title: product.title || "",
			price: product.price || "",
			description: product.description || "",
			category: product.category || "",
			image: product.image || "",
			rate: product.rate || "",
			count: product.count || ""
		}));

		res.status(200).send(products);
	} else {
		res.status(401).send({
			message: "No products found."
		});
	}
};

const getProductId = async (req: Request, res: Response) => {
	const productId = Number(req.params.id);

	const productData = await prisma.product.findFirst({
		where: { id: productId }
	});

	if (productData) {
		res.status(200).send(productData);
	} else {
		res.status(404).send({
			message: "No product found with the given ID."
		});
	}
};

export default {
	sendProduct,
	getProducts,
	getProductId
};
