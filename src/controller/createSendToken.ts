import { JwtPayload, sign, verify } from "jsonwebtoken";

import { IUser } from "../models/User";
import { Response } from "express";
import RefreshToken from "@/models/RefreshToken";
import ResponseStatus from "@/utils/ResponseStatus";

export const generateAccessToken = (
    user: any
) => {
    return sign(
        {
            ...user,
        },
        process.env.JWT_SECRET!!,
        { expiresIn: process.env.JWT_EXPIRES_IN!! }
    )
}

export const generateRefreshToken = (user: any) => {
    return sign(
        { ...user },
        process.env.JWT_REFRESH_SECRET!!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN!! }
    );
}

export const verifyRefreshToken = (token: string) => {
    return verify(token, process.env.JWT_REFRESH_SECRET!!) as JwtPayload;
}

const createSendToken = async (user: IUser, res: Response, status: number) => {

    const accessToken = generateAccessToken({
        uid: user._id,
        email: user.email,
        emailVerfied: user.emailVerified,
    });

    const refreshToken = generateRefreshToken({
        uid: user._id
    });

    await RefreshToken.create({
        token: refreshToken,
        uid: user._id,
        version: 0
    });

    const expiresIn = `${parseInt(process.env.JWT_EXPIRES_IN!!) * 3600}`;

    return res.status(status).json({
        status: ResponseStatus.SUCCESS,
        data: {
            idToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: expiresIn
        }
    });
}

export default createSendToken;