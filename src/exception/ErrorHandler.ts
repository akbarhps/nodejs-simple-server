import {Response} from 'express';
import {WebError, HttpCode} from './WebError';

class ErrorHandler {

    public handleError(err: WebError | Error, res?: Response): void {
        if (this.isTrustedError(err) && res) {
            this.handleTrustedError(err as WebError, res);
        } else {
            this.handleUntrustedError(err, res);
        }
    }

    public isTrustedError(err: Error): boolean {
        if (err instanceof WebError) {
            return err.isOperational;
        }

        return false;
    }

    private handleTrustedError(err: WebError, res: Response): void {
        res.status(err.code).json({'message': err.message});
    }

    private handleUntrustedError(error: Error | WebError, res?: Response): void {
        if (res) {
            res.status(HttpCode.INTERNAL_SERVER_ERROR)
                .json({'message': 'Internal server error'});
        }

        console.log('Application encountered an untrusted error.');
        console.log(error);
    }
}

export const errorHandler = new ErrorHandler();
