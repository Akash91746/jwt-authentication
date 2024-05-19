import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User";
import ResponseStatus from "@/utils/ResponseStatus";
import ResponseStatusCode from "@/utils/ResponseStatusCode";
import catchAsync from "@/utils/catchAsync";
import mongoose from "mongoose";
import { InvalidEmailOrPasswordError, InvalidRefresthToken } from "./errors";
import createSendToken, { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "./createSendToken";

export const signupWithEmail = catchAsync(async (req, res) => {
    const data = req.body;

    const user = await User.create({
        email: data.email,
        confirmPassword: data.confirmPassword,
        password: data.password
    });

    createSendToken(user, res, ResponseStatusCode.Created);
});


export const signinWithEmail = catchAsync(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password!!))) {
        throw new InvalidEmailOrPasswordError();
    }

    createSendToken(user, res, ResponseStatusCode.Ok);
});

export const signOut = catchAsync(async (req, res) => {

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        throw new Error("Refresh Token is required");
    }

    await RefreshToken.deleteOne({ token: refreshToken });

    res.status(ResponseStatusCode.Ok).json({
        status: ResponseStatus.SUCCESS
    });
});

export const refresh = catchAsync(async (req, res) => {

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        throw new Error("Refresh Token is required");
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    
    if (!tokenDoc) {
        throw new InvalidRefresthToken();
    }

    const result = verifyRefreshToken(tokenDoc.token);

    const accessToken = generateAccessToken({ uid: result.uid });
    const newRefreshToken = generateRefreshToken({ uid: result.uid });

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        await tokenDoc.deleteOne({ session: session });

        await RefreshToken.create([{
            token: newRefreshToken,
            uid: result.uid,
            version: ++tokenDoc.version
        }], { session: session });

        await session.commitTransaction();
    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        await session.endSession();
    }

    const expiresIn = `${parseInt(process.env.JWT_EXPIRES_IN!!) * 3600}`;

    res.status(ResponseStatusCode.Created).json({
        status: ResponseStatus.SUCCESS,
        data: {
            idToken: accessToken,
            refreshToken: newRefreshToken,
            expiresIn: expiresIn
        }
    });
});