import {v4 as uuidv4} from 'uuid';
import {compare, encrypt} from '../util/bcrypt';
import {WebError} from '../exception/WebError';
import {UserAuthentication} from '../entity/UserAuthentication';
import {RegisterUserRequest} from '../model/RegisterUserRequest';
import {RegisterUserResponse} from '../model/RegisterUserResponse';
import {UserAuthenticationRepository} from '../repository/UserAuthenticationRepository';
import {LoginUserRequest} from "../model/LoginUserRequest";
import {LoginUserResponse} from "../model/LoginUserResponse";

export class UserAuthenticationService {

    readonly repository: UserAuthenticationRepository;

    constructor(repository: UserAuthenticationRepository) {
        this.repository = repository;
    }

    register = async (request: RegisterUserRequest): Promise<RegisterUserResponse> => {
        const {value, error} = request.validate();
        if (error) {
            throw WebError.badRequest(error.details[0].message);
        }

        const isEmailTaken = await this.repository.isEmailTaken(value.email);
        if (isEmailTaken) {
            throw WebError.badRequest('Email is already taken');
        }

        const isUsernameTaken = await this.repository.isUsernameTaken(value.username);
        if (isUsernameTaken) {
            throw WebError.badRequest('Username is already taken');
        }

        const encryptedPassword = await encrypt(value.password);

        const user: UserAuthentication = {
            id: uuidv4().toString(),
            username: value.username,
            password: encryptedPassword,
            email: value.email,
            createdAt: new Date(),
            updatedAt: null
        };

        await this.repository.create(user);

        const response: RegisterUserResponse = {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        }
        return response;
    }

    login = async (request: LoginUserRequest): Promise<LoginUserResponse> => {
        const {value, error} = request.validate();
        if (error) {
            throw WebError.badRequest(error.details[0].message);
        }

        const user = await this.repository.findByUsernameOrEmail(value.usernameOrEmail)
        if (!user) {
            throw WebError.badRequest('Username or email doesn\'t match any of our record');
        }

        const isPasswordValid = await compare(value.password, user.password);
        if (!isPasswordValid) {
            throw WebError.badRequest('Password is not valid');
        }

        const response: RegisterUserResponse = {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        }
        return response;
    }
}