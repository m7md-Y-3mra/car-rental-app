import CustomError from "./CustomError";

class InvalidTokenError extends CustomError<ErrorCode> {}
export default InvalidTokenError;
