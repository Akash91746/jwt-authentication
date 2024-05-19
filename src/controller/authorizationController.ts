import User from "@/models/User";
import catchAsync from "@/utils/catchAsync";
import { NotLoggedInError } from "./errors";
import getDecodedToken from "./getDecodedToken";

export const protect = catchAsync(async (req, res, next) => {

    const decoded = getDecodedToken(req);

    if (!decoded) {
        return next(new NotLoggedInError());
    }

    const user = await User.findById(decoded.uid);

    if (!user) {
        throw new NotLoggedInError();
    }

    req.user = user;

    next();
});