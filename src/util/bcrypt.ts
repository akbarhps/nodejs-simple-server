import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function compare(password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
}