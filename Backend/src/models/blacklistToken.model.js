import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 //24hr in seconds
  }
})

export const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema)