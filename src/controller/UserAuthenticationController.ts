import {NextFunction, Request, Response} from "express";
import {HttpCode} from "../exception/WebError";
import {WebResponse} from "../model/WebResponse";
import {RegisterUserRequest} from "../model/RegisterUserRequest";
import {RegisterUserResponse} from "../model/RegisterUserResponse";
import {UserAuthenticationService} from '../service/UserAuthenticationService';
import {LoginUserRequest} from "../model/LoginUserRequest";
import {LoginUserResponse} from "../model/LoginUserResponse";

export class UserAuthenticationController {

    readonly service: UserAuthenticationService;

    constructor(service: UserAuthenticationService) {
        this.service = service;
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        const userRequest = RegisterUserRequest.fromRequestBody(req.body);

        try {
            const userResponse = await this.service.register(userRequest);
            const webResponse: WebResponse<RegisterUserResponse> = {
                status: HttpCode.CREATED,
                message: 'User registered successfully',
                data: userResponse
            };
            res.status(webResponse.status).json(webResponse);
        } catch (err) {
            next(err);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const userRequest = LoginUserRequest.fromRequestBody(req.body);

        try {
            const userResponse = await this.service.login(userRequest);
            const webResponse: WebResponse<LoginUserResponse> = {
                status: HttpCode.OK,
                message: 'ok',
                data: userResponse
            };
            res.status(webResponse.status).json(webResponse);
        } catch (err) {
            next(err);
        }
    }
}