import mongoose, { Document } from "mongoose";
import * as validator from "validator";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    uid: string,
    email: string,
    password: string,
    emailVerified: boolean,
    confirmPassword?: string,
    passwordChangedAt: Date,
}

interface IUserInstanceMethods {
    comparePassword(newPassword: string, encryptedPassword: string): Promise<boolean>;
}

export const userSchema = new mongoose.Schema<IUser, any, IUserInstanceMethods>({
    uid: {
        type: String,
        unique: true,
        default: function () {
            return this._id!!.toString();;
        }
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: false,
        sparse: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email"]
    },
    password: {
        type: String,
        required: false,
        minlength: 8,
        select: false,
        validate: {
            validator: function (value: string) {
                return validator.isStrongPassword(value,
                    {
                        minLength: 8,
                        minNumbers: 0,
                        minLowercase: 0,
                        minUppercase: 0
                    }
                );
            }
        }
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm password is required"],
        validate: {
            validator: function (this: IUser, value: string) {
                return value === this.password
            },
            message: "Confirm password is not same"
        }
    },
    passwordChangedAt: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {

    if (!this.isModified('password')) return next();

    if (this.password)
        this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    if (!this.isNew) {
        this.passwordChangedAt = new Date(Date.now() - 1000);
    }

    next();
});

userSchema.methods.comparePassword = function (newPassword, encryptedPassword) {
    return bcrypt.compare(newPassword, encryptedPassword);
}

const User = mongoose.model("user", userSchema);

export default User;
