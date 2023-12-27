import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import "express-async-errors";

import config from "../configs/config.js";
import { authRouter } from "./apps/auth-service/index.js";
import { checkConnection } from "./config/postgres.js";

const app = express();

// Middlewares
app.use((req: Request, res: Response, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    app.use(express.urlencoded({ extended: true }));
  }
  next();
});
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  }),
);
app.use("/api/auth", authRouter);

// health check
app.get("/api/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.listen(config.port, () => {
  console.log("> Server is listening on port:", config.port);
});

checkConnection();
