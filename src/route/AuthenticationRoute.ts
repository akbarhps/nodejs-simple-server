import {Router} from 'express';
import {UserAuthenticationController} from "../controller/UserAuthenticationController";

export class AuthenticationRoute {

    readonly controller: UserAuthenticationController;

    constructor(controller: UserAuthenticationController) {
        this.controller = controller;
    }

    getRouter = (group: string = ''): Router => {
        const router = Router()

        router.post(`${group}/sign-up`, this.controller.register);
        router.post(`${group}/sign-in`, this.controller.register);
        router.post(`${group}/sign-out`, this.controller.register);

        return router;
    }
}
