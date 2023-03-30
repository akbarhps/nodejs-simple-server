import express, {Express, NextFunction, Request, Response} from "express";
import cors from "cors";
import {createWriteStream} from "fs";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import {PrismaClient} from "@prisma/client";
import {collectDefaultMetrics, Registry} from "prom-client";
import {errorHandler} from "./exception/ErrorHandler";
import {UserAuthenticationRepository} from "./repository/UserAuthenticationRepository";
import {UserAuthenticationService} from "./service/UserAuthenticationService";
import {AuthenticationRoute} from "./route/AuthenticationRoute";
import {UserAuthenticationController} from "./controller/UserAuthenticationController";

dotenv.config();

const app: Express = express();
const prisma: PrismaClient = new PrismaClient();

const port = process.env.PORT;
const logPrintMode = process.env.LOG_PRINT_MODE || "dev";
const logWriteMode = process.env.LOG_WRITE_MODE || "dev";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan(logPrintMode));
app.use(morgan(logWriteMode, {
    stream: createWriteStream("./logs/access.log", {flags: "a"})
}));

const register = new Registry();
register.setDefaultLabels({app: 'node-metrics'});
collectDefaultMetrics({register});

app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.use((req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.get("/", (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({
        "message": "Hello World!"
    })
});


// Repository
const authRepository = new UserAuthenticationRepository(prisma);


// Service
const authService = new UserAuthenticationService(authRepository);


// Controller
const authController = new UserAuthenticationController(authService);


// Route
const authRouter = new AuthenticationRoute(authController);


app.use('/auth', authRouter.getRouter());


app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    errorHandler.handleError(err, res);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port: ${port}`);
    console.log(`⚡️[server]: url: http://localhost:${port}`);
});