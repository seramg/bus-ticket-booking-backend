import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {
  createTrip,
  getTripById,
  listTrips,
  searchTrips,
} from "../controllers/trips";

const tripRoutes: Router = Router();

tripRoutes.post("/", errorHandler(createTrip));
tripRoutes.get("/", listTrips);
tripRoutes.get("/search", searchTrips);
tripRoutes.get("/:id", getTripById);

export default tripRoutes;
