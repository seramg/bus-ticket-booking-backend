import { Response, Request, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../secrets";
import { prismaClient } from "..";

import { User } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the authorization header
  const authHeader = req.headers.authorization;
  // Check if the authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header not found or invalid format.",
      errorDetail: {},
    });
  }

    // Extract the token by removing "Bearer " from the authorization header
    const token = authHeader.split(" ")[1];

  try {
    //3. if the token is present, verify that token and extract the payload
    const payload = jwt.verify(token, ACCESS_TOKEN) as any;
    //4.to get the user from payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist or unauthorized to continue session.",
        errorDetail: {},
      });
    }
    //5. to attach user to the current request object
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "jwt expired.",
        errorDetail: {},
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "invalid token.",
        errorDetail: {},
      });
    } else {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
  }
};
export default authMiddleware;
