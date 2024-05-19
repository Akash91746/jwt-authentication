import mongoose, { Document, ObjectId } from "mongoose";

export interface IRefreshToken extends Document {
    uid: ObjectId,
    token: string,
    version: number
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
    uid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    version: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const RefreshToken = mongoose.model("refresh-tokens", refreshTokenSchema);

export default RefreshToken;




