import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";

const authRoutes: Router = Router();

authRoutes.post("/sign-up", errorHandler(signup));
authRoutes.post("/sign-in", errorHandler(signin));
authRoutes.post("/logout", [authMiddleware], logout);

export default authRoutes;
