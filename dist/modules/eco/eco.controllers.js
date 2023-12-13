"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../plugins/prisma");
const moment_1 = __importDefault(require("moment"));
const sendMovie = async (req, res) => {
    const movie = req.body;
    if (!movie) {
        return res.status(400).send({
            success: false,
            error: "Movie information is missing in the request body."
        });
    }
    await prisma_1.prisma.movie.create({
        data: {
            author: movie.author || "unknown",
            title: movie.title || "unknown",
            image: movie.image || "unknown",
            createdAt: (0, moment_1.default)().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z"),
            updatedAt: (0, moment_1.default)().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z")
        }
    });
    res.status(200).send({
        success: true,
        data: movie
    });
};
const getMovies = async (req, res) => {
    const movieData = await prisma_1.prisma.movie.findMany();
    if (movieData.length > 0) {
        const products = movieData.map((movie) => ({
            id: movie.id,
            author: movie.author,
            title: movie.title,
            image: movie.image,
            createdAt: movie.createdAt,
            updatedAt: movie.updatedAt
        }));
        res.status(200).send(products);
    }
    else {
        res.status(401).send({
            message: "No products found."
        });
    }
};
const getMovieId = async (req, res) => {
    const movieId = Number(req.params.id);
    const movieData = await prisma_1.prisma.movie.findFirst({
        where: { id: movieId }
    });
    if (movieData) {
        res.status(200).send(movieData);
    }
    else {
        res.status(404).send({
            message: "No movie found with the given ID."
        });
    }
};
const updateMovie = async (req, res) => {
    const movieId = Number(req.params.id);
    const updatedMovie = req.body;
    const existingMovie = await prisma_1.prisma.movie.findFirst({
        where: { id: movieId }
    });
    if (!existingMovie) {
        return res.status(404).send({
            message: "No movie found with the given ID."
        });
    }
    const newMovie = await prisma_1.prisma.movie.update({
        where: { id: movieId },
        data: {
            ...existingMovie,
            ...updatedMovie,
            updatedAt: (0, moment_1.default)().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z")
        }
    });
    res.status(200).send({
        success: true,
        message: "Movie updated successfully.",
        updatedMovie: newMovie
    });
};
const deleteMovie = async (req, res) => {
    const movieId = Number(req.params.id);
    const deletedMovie = await prisma_1.prisma.movie.delete({
        where: { id: movieId }
    });
    res.status(200).send({
        success: true,
        message: "Movie deleted successfully.",
        deletedMovie
    });
};
exports.default = {
    sendMovie,
    getMovies,
    getMovieId,
    updateMovie,
    deleteMovie
};
