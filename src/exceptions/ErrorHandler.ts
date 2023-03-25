import {Response} from 'express';
import {AppError, HttpCode} from './AppError';

class ErrorHandler {

    public handleError(err: AppError | Error, res?: Response): void {
        if (this.isTrustedError(err) && res) {
            this.handleTrustedError(err as AppError, res);
        } else {
            this.handleUntrustedError(err, res);
        }
    }

    public isTrustedError(err: Error): boolean {
        if (err instanceof AppError) {
            return err.isOperational;
        }

        return false;
    }

    private handleTrustedError(err: AppError, res: Response): void {
        res.status(err.httpCode).json({'message': err.message});
    }

    private handleUntrustedError(error: Error | AppError, res?: Response): void {
        if (res) {
            res.status(HttpCode.INTERNAL_SERVER_ERROR)
                .json({'message': 'Internal server error'});
        }

        console.log('Application encountered an untrusted error.');
        console.log(error);
    }
}

export const errorHandler = new ErrorHandler();
