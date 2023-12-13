import { Request, Response } from "express";
import { prisma } from "../../plugins/prisma";
import moment from "moment";

interface MovieType {
	author: string;
	title: string;
	image: string;
}

const sendMovie = async (req: Request, res: Response) => {
	const movie = req.body as MovieType;

	if (!movie) {
		return res.status(400).send({
			success: false,
			error: "Movie information is missing in the request body."
		});
	}

	await prisma.movie.create({
		data: {
			author: movie.author || "unknown",
			title: movie.title || "unknown",
			image: movie.image || "unknown",
			createdAt: moment().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z"),
			updatedAt: moment().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z")
		}
	});

	res.status(200).send({
		success: true,
		data: movie
	});
};

const getMovies = async (req: Request, res: Response) => {
	const movieData = await prisma.movie.findMany();

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
	} else {
		res.status(401).send({
			message: "No products found."
		});
	}
};

const getMovieId = async (req: Request, res: Response) => {
	const movieId = Number(req.params.id);

	const movieData = await prisma.movie.findFirst({
		where: { id: movieId }
	});

	if (movieData) {
		res.status(200).send(movieData);
	} else {
		res.status(404).send({
			message: "No movie found with the given ID."
		});
	}
};

const updateMovie = async (req: Request, res: Response) => {
	const movieId = Number(req.params.id);
	const updatedMovie = req.body as Partial<MovieType>;

	const existingMovie = await prisma.movie.findFirst({
		where: { id: movieId }
	});

	if (!existingMovie) {
		return res.status(404).send({
			message: "No movie found with the given ID."
		});
	}

	const newMovie = await prisma.movie.update({
		where: { id: movieId },
		data: {
			...existingMovie,
			...updatedMovie,
			updatedAt: moment().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z")
		}
	});

	res.status(200).send({
		success: true,
		message: "Movie updated successfully.",
		updatedMovie: newMovie
	});
};

const deleteMovie = async (req: Request, res: Response) => {
	const movieId = Number(req.params.id);

	const deletedMovie = await prisma.movie.delete({
		where: { id: movieId }
	});

	res.status(200).send({
		success: true,
		message: "Movie deleted successfully.",
		deletedMovie
	});
};

export default {
	sendMovie,
	getMovies,
	getMovieId,
	updateMovie,
	deleteMovie
};
