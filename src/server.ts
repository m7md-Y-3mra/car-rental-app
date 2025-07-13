import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import errorHandler from "./middleware/error-handler";
import v1 from "./routes/v1";

export const createServer = () => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  app.get("/health", async (req: Request, res: Response) => {
    res.status(200).json({ ok: true, env: process.env.NODE_ENV });
  });

  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
