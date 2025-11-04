import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  isValidPassword(password: string): Promise<boolean>;
  generateJWT(): string;
}

export interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [50, "Email must not be longer than 50 characters"],
  },
  password: {
    type: String,
    select: false,
  },
  username: {
    type: String,
  },
});

userSchema.statics.hashPassword = async function (password: string) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email, id: this._id }, "nnanna", {
    expiresIn: "24h",
  });
};

const User =
  (mongoose.models.user as IUserModel) ||
  mongoose.model<IUser, IUserModel>("user", userSchema);

export default User;
