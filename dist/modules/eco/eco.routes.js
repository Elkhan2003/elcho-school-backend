"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eco_controllers_1 = __importDefault(require("./eco.controllers"));
const router = (0, express_1.Router)();
router.post("/send-movie", eco_controllers_1.default.sendMovie);
router.get("/get-movies", eco_controllers_1.default.getMovies);
router.get("/get-movie/:id", eco_controllers_1.default.getMovieId);
router.put("/update-movie/:id", eco_controllers_1.default.updateMovie);
router.delete("/delete-movie/:id", eco_controllers_1.default.deleteMovie);
exports.default = router;
