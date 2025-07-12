import express, { Request, Response } from "express";
import v1 from "./routes/v1";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middleware/error-handler";
import EntityNotFoundError from "./errors/EntityNotFoundError";

export const createServer = () => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded())
    .use(express.json())
    .use(cors());

  app.get("/health", async (req: Request, res: Response) => {
    // throw new EntityNotFoundError({
    //   message: "Entity not found",
    //   statusCode: 400,
    //   code: "ERR_NF",
    // });
    res.status(200).json({ ok: true, env: process.env.NODE_ENV });
  });

  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
