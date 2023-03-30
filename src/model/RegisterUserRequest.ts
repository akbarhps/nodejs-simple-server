import Joi from 'joi';

export class RegisterUserRequest {
    email: string;
    username: string;
    password: string;

    private validationSchema = Joi.object({
        email: Joi.string().email().max(100).required(),
        username: Joi.string().alphanum().min(3).max(16).required(),
        password: Joi.string().min(8).required()
    });

    constructor(email: string, username: string, password: string) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    static fromRequestBody(body: any): RegisterUserRequest {
        return new RegisterUserRequest(body.email, body.username, body.password);
    }

    validate(): Joi.ValidationResult<RegisterUserRequest> {
        return this.validationSchema.validate({
            email: this.email,
            username: this.username,
            password: this.password
        });
    }
}