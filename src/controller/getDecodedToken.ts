import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { TokenExpiredError } from "./errors";

function getDecodedToken(req: Request): JwtPayload | null {
    let token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return null;
    }

    try {
        return verify(token, process.env.JWT_SECRET!!) as JwtPayload;
    } catch (e: any) {
        if (e.name === "TokenExpiredError") {
            throw new TokenExpiredError();
        }
        throw e;
    }
}


export default getDecodedToken;