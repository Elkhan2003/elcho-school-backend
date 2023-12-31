"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const verify_routes_1 = __importDefault(require("../modules/verify/verify.routes"));
const eco_routes_1 = __importDefault(require("../modules/eco/eco.routes"));
const test_routes_1 = __importDefault(require("../modules/test/test.routes"));
const router = (0, express_1.Router)();
router.use("/", auth_routes_1.default);
router.use("/", verify_routes_1.default);
router.use("/", eco_routes_1.default);
router.use("/", test_routes_1.default);
exports.default = router;
