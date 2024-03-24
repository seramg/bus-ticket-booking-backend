import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { createTrip, listTrips, searchTrips } from "../controllers/trips";
import {
  createBooking,
  getBookingsByPnr,
  getBookingsOfUser,
  listBookings,
} from "../controllers/bookings";

const bookingRoutes: Router = Router();

bookingRoutes.post("/", [authMiddleware], errorHandler(createBooking));
bookingRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listBookings)
);
bookingRoutes.get(
  "/user/all",
  [authMiddleware],
  errorHandler(getBookingsOfUser)
);
bookingRoutes.get(
  "/pnr/:pnrNumber",
  errorHandler(getBookingsByPnr)
);
export default bookingRoutes;
