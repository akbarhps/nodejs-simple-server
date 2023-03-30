export interface UserAuthentication {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}