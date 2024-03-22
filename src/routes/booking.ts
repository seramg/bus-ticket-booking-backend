import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { createTrip, listTrips, searchTrips } from "../controllers/trips";
import { createBooking, listBookings } from "../controllers/bookings";

const bookingRoutes: Router = Router();

bookingRoutes.post("/", [authMiddleware], errorHandler(createBooking));
bookingRoutes.get("/", [authMiddleware], errorHandler(listBookings));

export default bookingRoutes;
