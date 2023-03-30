import {PrismaClient} from '@prisma/client';
import {UserAuthentication} from '../entity/UserAuthentication';

export class UserAuthenticationRepository {

    readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    create = async (entity: UserAuthentication): Promise<UserAuthentication> => {
        await this.prisma.userAuthentication.create({
            data: {
                id: entity.id,
                username: entity.username,
                password: entity.password,
                email: entity.email,
                createdAt: entity.createdAt!,
            }
        });
        return entity;
    }

    findById = async (id: string): Promise<UserAuthentication | null> => {
        return this.prisma.userAuthentication.findUnique({
            where: {id: id}
        });
    }

    findByEmail = (email: string): Promise<UserAuthentication | null> => {
        return this.prisma.userAuthentication.findUnique({
            where: {email: email}
        });
    }

    findByUsername = async (username: string): Promise<UserAuthentication | null> => {
        return this.prisma.userAuthentication.findUnique({
            where: {username: username}
        });
    }

    findByUsernameOrEmail = async (usernameOrEmail: string): Promise<UserAuthentication | null> => {
        return this.prisma.userAuthentication.findFirst({
            where: {
                OR: [
                    {username: usernameOrEmail},
                    {email: usernameOrEmail}
                ]
            }
        });
    }

    isEmailTaken = async (email: string): Promise<boolean> => {
        const userAuthentication = await this.findByEmail(email);
        return userAuthentication !== null;
    }

    isUsernameTaken = async (username: string): Promise<boolean> => {
        const userAuthentication = await this.findByUsername(username);
        return userAuthentication !== null;
    }
}