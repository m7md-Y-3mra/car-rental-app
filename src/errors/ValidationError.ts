import CustomError from "./CustomError";
import { ErrorCode } from "./types";

class ValidationError extends CustomError<ErrorCode> {
  errors: { message: string }[];

  constructor({
    message,
    statusCode,
    code,
    errors,
  }: {
    message: string;
    statusCode: number;
    code?: ErrorCode;
    errors: { message: string }[];
  }) {
    super({ message, statusCode, code });
    this.errors = errors;
  }
}
export default ValidationError;
