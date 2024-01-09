import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { createUploadthingExpressHandler } from "uploadthing/express";

import config from "../configs/config.js";
import { authRouter, mail_router } from "./apps/auth/index.js";
import { company_router } from "./apps/company/routes.js";
import { uploadRouter } from "./services/upload_thing.js";

const app = express();

// Middlewares
app.use(cors());
app.use((req: Request, res: Response, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        app.use(express.urlencoded({ extended: true }));
    }
    next();
});

app.use(morgan("dev"));
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Log the error for debugging
    console.error(err.stack);

    // Send a generic error response to the client
    res.status(500).json({ error: "Something went wrong" });
    next();
});

app.use(
    "/api/uploadthing",
    createUploadthingExpressHandler({
        router: uploadRouter,
    }),
);

app.use("/api/auth", authRouter);
app.use("/api/company", company_router);
app.use("/api/mail", mail_router);

app.listen(config.port, () => {
    console.log("> Server is listening on port:", config.port);
});
