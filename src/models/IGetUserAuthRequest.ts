import { Request } from "express";

import { IUser } from "./User";

interface IGetUserAuthRequest extends Request {
    user?: IUser;
}

export default IGetUserAuthRequest;