import ResponseStatus from "./ResponseStatus";
import ResponseStatusCode from "./ResponseStatusCode";

class AuthError extends Error {
    status: ResponseStatus;
    statusCode: ResponseStatusCode;
    isOperational = true;
    code?: string;

    constructor(message: string, statusCode: number, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ?
            ResponseStatus.FAIL :
            ResponseStatus.ERROR;
        this.code = code;
    }
}

export default AuthError;