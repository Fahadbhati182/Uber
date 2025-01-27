import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { asyncHandler } from "../utils/AsynHandler.js";
import ApiError from "../utils/ApiError.js";

const authUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

    const isBlacklist = await User.findOne({ token: token })

    if (isBlacklist) {
      return ApiError(400, "aunthorized User")
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
    const user = await User.findById(decodedToken._id)

    req.user = user

    return next()

  } catch (error) {
    new ApiError(401, "Unauthorized request", error)
  }
})


export { authUser }