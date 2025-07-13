import CustomError from "./CustomError";
import { ErrorCode } from "./types";

class EmailVerifiedError extends CustomError<ErrorCode> {}
export default EmailVerifiedError;
