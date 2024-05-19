import ResponseStatusCode from "@/utils/ResponseStatusCode";
import AuthError from "../../utils/AuthError";
import AuthErrorCode from "./AuthErrorsCode";

export class InvalidEmailOrPasswordError extends AuthError {
    constructor() {
        super(
            "Invalid email or password",
            ResponseStatusCode.BadRequest,
            AuthErrorCode.INVALID_CREDENTIALS
        );
    }
}


export class InvalidRefresthToken extends AuthError {
    constructor() {
        super("Invalid refresh token",
            ResponseStatusCode.Forbidden,
            AuthErrorCode.INVALID_REFRESH_TOKEN
        )
    }
}

export class NotLoggedInError extends AuthError {
    constructor() {
        super(
            "Not Logged In",
            ResponseStatusCode.Unauthorized
        );
    }
}

export class TokenExpiredError extends AuthError {
    constructor() {
        super(
            "Token Expired",
            ResponseStatusCode.Unauthorized,
            AuthErrorCode.TOKEN_EXPIRED
        )
    }
}