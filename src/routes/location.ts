import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { createLocation, listLocations } from "../controllers/locations";

const locationRoutes: Router = Router();

locationRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createLocation)
);
locationRoutes.get("/", listLocations);

export default locationRoutes;
