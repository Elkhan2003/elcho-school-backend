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

	if (!movie || !movie.author || !movie.title || !movie.image) {
		return res.status(400).send({
			success: false,
			error:
				"All fields (author, title, image) must be provided in the request body."
		});
	}

	// Check if the movie with the same title already exists
	const existingMovieTitle = await prisma.movie.findFirst({
		where: {
			title: movie.title
		}
	});

	const existingMovieImage = await prisma.movie.findFirst({
		where: {
			image: movie.image
		}
	});

	if (existingMovieTitle || existingMovieImage) {
		return res.status(400).send({
			success: false,
			error: "Movie with the same title already exists."
		});
	}

	const newMovie = await prisma.movie.create({
		data: {
			author: movie.author,
			title: movie.title,
			image: movie.image,
			createdAt: moment().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z"),
			updatedAt: moment().utcOffset(6).format("YYYY-MM-DD HH:mm:ss Z")
		}
	});

	res.status(200).send({
		success: true,
		data: newMovie
	});
};

const getMovies = async (req: Request, res: Response) => {
	const movieData = await prisma.movie.findMany();

	if (movieData.length > 0) {
		const movies = movieData.map((movie) => ({
			id: movie.id,
			author: movie.author,
			title: movie.title,
			image: movie.image,
			createdAt: movie.createdAt,
			updatedAt: movie.updatedAt
		}));

		res.status(200).send(movies);
	} else {
		res.status(401).send({
			message: "No movies found."
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

	try {
		const deletedMovie = await prisma.movie.delete({
			where: { id: movieId }
		});

		if (deletedMovie) {
			res.status(200).send({
				success: true,
				message: "Movie deleted successfully.",
				deletedMovie
			});
		} else {
			res.status(404).send({
				message: "No movie found with the given ID."
			});
		}
	} catch (error) {
		// Handle the error when the movie is not found
		// @ts-ignore
		if (error.code === "P2025") {
			res.status(404).send({
				message: "No movie found with the given ID."
			});
		} else {
			// Handle other errors
			console.error(error);
			res.status(500).send({
				message: "Internal Server Error"
			});
		}
	}
};

// const deleteMovie = async (req: Request, res: Response) => {
// 	const movieId = Number(req.params.id);
//
// 	const deletedMovie = await prisma.movie.delete({
// 		where: { id: movieId }
// 	});
//
// 	if (deletedMovie) {
// 		res.status(200).send({
// 			success: true,
// 			message: "Movie deleted successfully.",
// 			deletedMovie
// 		});
// 	} else {
// 		res.status(404).send({
// 			message: "No movie found with the given ID."
// 		});
// 	}
// };

export default {
	sendMovie,
	getMovies,
	getMovieId,
	updateMovie,
	deleteMovie
};
