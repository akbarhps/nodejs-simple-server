import {NextFunction, Request, Response} from "express";
import {UserAuthenticationService} from '../service/UserAuthenticationService';
import {WebResponse} from "../model/WebResponse";
import {RegisterUserResponse} from "../model/RegisterUserResponse";
import {HttpCode} from "../exception/WebbError";
import {RegisterUserRequest} from "../model/RegisterUserRequest";

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
}