import { Router } from "express";
import authRoute from "./auth";

const v1: Router = Router();

v1.use("/api/auth", authRoute);

export default v1;
