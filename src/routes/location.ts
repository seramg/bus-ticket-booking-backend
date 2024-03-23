import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import {
  bulkLocations,
  createLocation,
  listLocations,
} from "../controllers/locations";

const locationRoutes: Router = Router();

locationRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createLocation)
);
locationRoutes.get("/", listLocations);
locationRoutes.post(
  "/bulk-locations-create",
  [authMiddleware, adminMiddleware],
  errorHandler(bulkLocations)
);

export default locationRoutes;
