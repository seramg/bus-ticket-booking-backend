import { Router } from "express";
import authRoutes from "./auth";
import usersRoutes from "./users";
import locationRoutes from "./location";
import busRoutes from "./bus";
import tripRoutes from "./trips";
import bookingRoutes from "./booking";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/location", locationRoutes);
rootRouter.use("/user", usersRoutes);
rootRouter.use("/bus", busRoutes);
rootRouter.use("/trip", tripRoutes);
rootRouter.use("/booking", bookingRoutes);

export default rootRouter;
