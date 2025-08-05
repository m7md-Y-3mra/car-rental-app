import CustomError from "@/errors/CustomError";
import ValidationError from "@/errors/ValidationError";
import { getErrorMessage } from "@/utils/errorMessage";
import { NextFunction, Request, Response } from "express";

const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({
      error: {
        message: error.message,
        code: error.code,
        errors: error.errors,
      },
    });
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).send({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  res.status(500).send({
    error: {
      message: getErrorMessage(error) || "An error occurred. Please view logs for more details",
    },
  });
};

export default errorHandler;
