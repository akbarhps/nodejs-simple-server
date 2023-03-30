export interface WebResponse<T> {
    status: number;
    message: string;
    data: T | null;
}