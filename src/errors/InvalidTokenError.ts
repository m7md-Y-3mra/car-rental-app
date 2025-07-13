import CustomError from "./CustomError";
import { ErrorCode } from "./types";

class InvalidTokenError extends CustomError<ErrorCode> {}
export default InvalidTokenError;
