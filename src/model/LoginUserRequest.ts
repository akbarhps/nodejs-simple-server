import Joi from "joi";

export class LoginUserRequest {
    usernameOrEmail: string;
    password: string;

    private readonly validationSchema = Joi.object({
        usernameOrEmail: [
            Joi.string().email().max(100),
            Joi.string().alphanum().min(3).max(16)
        ],
        password: Joi.string().min(8).required()
    });

    constructor(usernameOrEmail: string, password: string) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    static fromRequestBody(body: any): LoginUserRequest {
        return new LoginUserRequest(body['username_or_email'], body.password);
    }

    validate(): Joi.ValidationResult<LoginUserRequest> {
        return this.validationSchema.validate({
            usernameOrEmail: this.usernameOrEmail,
            password: this.password
        });
    }
}