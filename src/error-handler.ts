import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-requests";
import { UnprocessableEntity } from "./exceptions/validation";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      console.log(error)
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          const errors = [];
          error.errors.forEach((err) => {
            // Map Zod errors to custom error messages
            errors.push(err.message);
          });
          exception = new UnprocessableEntity(
            "Unprocessable entity.",
            ErrorCode.UNPROCESSABLE_ENTITY,
            { errors: errors }
          );
        } else {
          exception = new InternalException(
            "Something went wrong!",
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      res.status(exception.statusCode).json({
        success: false,
        message: exception.message,
        errorDetail: exception.errors || {}, // Include error details if available
      });
      next();
    }
  };
};
