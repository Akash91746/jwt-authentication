import { NextFunction, Request, Response } from "express";
import IGetUserAuthRequest from "../models/IGetUserAuthRequest";
import ResponseStatus from "./ResponseStatus";

type AppResponseBody = {
    status: ResponseStatus,
    data?: any,
    message?: string,
    statusCode?: string,

    [key: string]: any
};

const catchAsync = (
    fn: (req: IGetUserAuthRequest, res: Response<AppResponseBody, any>, next: NextFunction) => Promise<any>
) => (req: Request, res: Response<AppResponseBody, any>, next: NextFunction): Promise<any> => {

    return fn(req, res, next).catch((err: any) => {
        next(err);
    });
};

export default catchAsync;