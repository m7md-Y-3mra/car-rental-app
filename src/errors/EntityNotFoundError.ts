import CustomError from "./CustomError";
import { ErrorCode } from "./types";

class EntityNotFoundError extends CustomError<ErrorCode> {}
export default EntityNotFoundError;
