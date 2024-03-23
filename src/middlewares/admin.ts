import { NextFunction, Response, Request } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;
