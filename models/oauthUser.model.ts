import mongoose, { Document, Model } from "mongoose";

export interface IOAuthUser extends Document {
  provider: string;
  providerId: string;
  email?: string;
  username?: string;
  image?: string;
  createdAt?: Date;
}

export interface IOAuthUserModel extends Model<IOAuthUser> {}

const oauthUserSchema = new mongoose.Schema<IOAuthUser, IOAuthUserModel>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  email: { type: String, lowercase: true, trim: true },
  username: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const OAuthUser =
  (mongoose.models.oauthUser as IOAuthUserModel) ||
  mongoose.model<IOAuthUser, IOAuthUserModel>("oauthUser", oauthUserSchema);

export default OAuthUser;
