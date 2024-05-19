import express from "express";
import morgan from "morgan";

import authRoutes from "@/routes/authRoutes";
import ResponseStatus from "./utils/ResponseStatus";
import ResponseStatusCode from "./utils/ResponseStatusCode";
import errorHandler from "./controller/errorController";

const app = express();

app.use(morgan("combined"));

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (_, res) => {
    return res.status(ResponseStatusCode.Ok).json({
        status: ResponseStatus.SUCCESS,
        data: "Jwt Authentication in Node.js"
    });
});

app.use(errorHandler);

export default app;