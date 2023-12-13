import { Router } from "express";
import movieControllers from "./eco.controllers";

const router = Router();

router.post("/send-movie", movieControllers.sendMovie);
router.get("/get-movies", movieControllers.getMovies);
router.get("/get-movie/:id", movieControllers.getMovieId);
router.put("/update-movie/:id", movieControllers.updateMovie);
router.delete("/delete-movie/:id", movieControllers.deleteMovie);

export default router;
