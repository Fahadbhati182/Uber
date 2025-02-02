import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { asyncHandler } from "../utils/AsynHandler.js";
import ApiError from "../utils/ApiError.js";
import { BlackListToken } from "../models/blacklistToken.model.js";
import { Captain } from "../models/captain.model.js";

const authUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const isBlacklist = await BlackListToken.findOne({ token: token })

    if (isBlacklist) {
      return ApiError(400, "aunthorized User")
    }


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
    const user = await User.findById(decodedToken._id)

    req.user = user

    return next()

  } catch (error) {
    new ApiError(401, "Unauthorized request", error)
  }
})


const authCaptain = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new ApiError(401, "Uuthorized Request")
    }

    const isBlacklist = await BlackListToken.findOne({ token: token })

    if (isBlacklist) {
      throw new ApiError(401, "Uuthorized Request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
    const captain = await Captain.findById(decodedToken._id)

    console.log("captain",captain)

    req.captain = captain
    return next()
  } catch (error) {
    new ApiError(401, "Something went wrong while creating authCaptain", error)
  }
})


export { authUser, authCaptain }