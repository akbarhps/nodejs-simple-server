export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface WebErrorProps {
    name?: string;
    code: HttpCode;
    message: string;
    isOperational?: boolean;
}

export class WebError extends Error {
    public readonly name: string;
    public readonly code: HttpCode;
    public readonly isOperational: boolean = true;

    constructor(props: WebErrorProps) {
        super(props.message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = props.name || 'Error';
        this.code = props.code;

        if (props.isOperational !== undefined) {
            this.isOperational = props.isOperational;
        }

        Error.captureStackTrace(this);
    }

    static badRequest(message: any | null): WebError {
        return new WebError({
            code: HttpCode.BAD_REQUEST,
            name: 'Bad Request',
            message: message || 'Bad Request',
        });
    }
}
