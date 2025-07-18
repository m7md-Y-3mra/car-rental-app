import CustomError from "./CustomError";
import { ErrorCode } from "./types";

class AuthenticationError extends CustomError<ErrorCode> {}
export default AuthenticationError;
