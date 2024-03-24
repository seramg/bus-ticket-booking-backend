import { Router } from "express";
import { bulkSignUp, logout, renewToken, signin, signup } from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import refreshAuthMiddleware from "../middlewares/refreshAuth";

const authRoutes: Router = Router();

authRoutes.post("/sign-up", errorHandler(signup));
authRoutes.post("/sign-in", errorHandler(signin));
authRoutes.post("/logout", [authMiddleware], logout);
authRoutes.post("/bulk-sign-up", errorHandler(bulkSignUp));
authRoutes.post("/renew-token",[refreshAuthMiddleware], errorHandler(renewToken));

export default authRoutes;
