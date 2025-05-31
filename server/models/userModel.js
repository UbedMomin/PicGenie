import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { Type: String, required: true },
  email: { Type: String, required: true, unique: true },
  password: { Type: String, required: true },
  creditBalance: {type: Number, default:5 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;