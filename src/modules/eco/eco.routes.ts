import { Router } from "express";
import productControllers from "./eco.controllers";

const router = Router();

router.post("/send-product", productControllers.sendProduct);
router.get("/get-products", productControllers.getProducts);
router.get("/get-product/:id", productControllers.getProductId);

export default router;
