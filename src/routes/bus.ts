import { Router } from "express";
import { createBus, listBuses } from "../controllers/buses";

const busRoutes: Router = Router();

busRoutes.post("/", createBus);
busRoutes.get("/", listBuses);

export default busRoutes;
