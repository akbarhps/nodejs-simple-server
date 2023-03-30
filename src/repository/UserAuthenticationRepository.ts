import {PrismaClient} from '@prisma/client';
import {UserAuthentication} from '../entity/UserAuthentication';

export class UserAuthenticationRepository {

    readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create(entity: UserAuthentication): Promise<UserAuthentication> {
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

    async findById(id: string): Promise<UserAuthentication | null> {
        return this.prisma.userAuthentication.findUnique({
            where: {id: id}
        });
    }

    async findByEmail(email: string): Promise<UserAuthentication | null> {
        return this.prisma.userAuthentication.findUnique({
            where: {email: email}
        });
    }

    async isEmailTaken(email: string): Promise<boolean> {
        const userAuthentication = await this.findByEmail(email);
        return userAuthentication !== null;
    }

    async findByUsername(username: string): Promise<UserAuthentication | null> {
        return this.prisma.userAuthentication.findUnique({
            where: {username: username}
        });
    }

    async isUsernameTaken(username: string): Promise<boolean> {
        const userAuthentication = await this.findByUsername(username);
        return userAuthentication !== null;
    }

}