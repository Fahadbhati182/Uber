import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsynHandler.js"
import { createUser } from "../services/user.service.js"
import { validationResult } from "express-validator"
import { User } from "../models/user.model.js"
import { BlackListToken } from "../models/blacklistToken.model.js"

const registerUser = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() })
  }

  const { fullName, password, email } = req.body
  
  const isUserAlreadyExit = await User.findOne({ email })
  if (isUserAlreadyExit) {
    throw new ApiError(400, "User Already Exit")
  }


  const hashedPassword = await User.hashPassword(password)

  const user = await createUser(
    {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword
    })

  const token = await user.generateAuthTokens()

  return res.status(200).json(
    new ApiResponse(200, "User Registered Successfully", { token, user })
  )
})

const loginUser = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() })
  }

  const { password, email } = req.body

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    throw new ApiError(401, "Invalid email or password")
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    throw new ApiError(401, "Invalid  password")

  }

  const token = user.generateAuthTokens();

  res.cookie('token', token)

  return res.status(200).json(
    new ApiResponse(200, "User login Successfully", { user, token })
  )

})

const getUserProfile = asyncHandler(async (req, res, next) => {

  const user = req.user

  return res.status(200).json(
    new ApiResponse(200, "User profile ", { user })
  )
})

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie('token')
  const token = req.cookies?.token || req.headers.authorization.split(' ')[1]

  await BlackListToken.create({ token })

  return res.status(200).json(
    new ApiResponse(200, "User LogOut ")
  )
})


export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
}