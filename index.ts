import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorHandler } from "./src/exceptions/ErrorHandler";
import { Registry, collectDefaultMetrics } from "prom-client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const logPrintMode = process.env.LOG_PRINT_MODE || "dev";
const logWriteMode = process.env.LOG_WRITE_MODE || "dev";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan(logPrintMode));
app.use(morgan(logWriteMode, {
    stream: fs.createWriteStream("./logs/access.log", { flags: "a" })
}));

const register = new Registry();

register.setDefaultLabels({ app: 'node-metrics' });

collectDefaultMetrics({ register });

app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.use((req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        "message": "Hello World!"
    })
});

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    errorHandler.handleError(err, res);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port: ${port}`);
});