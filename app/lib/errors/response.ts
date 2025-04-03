export type TError<T> = {
    message: string | unknown;
    hasError: boolean;
    body?: T;
};

