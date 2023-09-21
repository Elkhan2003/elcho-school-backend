"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../plugins/prisma");
const sendProduct = async (req, res) => {
    const { product } = req.body;
    await prisma_1.prisma.product.create({
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
    res.status(200).send({
        success: true,
        data: product
    });
};
const getProducts = async (req, res) => {
    const productData = await prisma_1.prisma.product.findMany();
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
    }
    else {
        res.status(401).send({
            message: "No products found."
        });
    }
};
const getProductId = async (req, res) => {
    const productId = req.params.Params.id;
    const productData = await prisma_1.prisma.product.findFirst({
        where: { id: productId }
    });
    if (productData) {
        res.status(200).send(productData);
    }
    else {
        res.status(404).send({
            message: "No product found with the given ID."
        });
    }
};
exports.default = {
    sendProduct,
    getProducts,
    getProductId
};
