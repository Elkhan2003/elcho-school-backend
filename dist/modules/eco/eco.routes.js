"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eco_controllers_1 = __importDefault(require("./eco.controllers"));
const router = (0, express_1.Router)();
router.post("/send-product", eco_controllers_1.default.sendProduct);
router.get("/get-products", eco_controllers_1.default.getProducts);
router.get("/get-product/:id", eco_controllers_1.default.getProductId);
exports.default = router;
