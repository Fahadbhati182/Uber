import { validationResult } from "express-validator";
import { Captain } from "../models/captain.model.js";
import createCaptain from "../services/captain.service.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { BlackListToken } from "../models/blacklistToken.model.js";


const registerCaptain = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() })
  }

  const { fullName, password, email, vechile } = req.body

  const isCaptainAlreadyExit = await Captain.findOne({ email })
  if (isCaptainAlreadyExit) {
    throw new ApiError(400, "Captain Already Exit")
  }

  const hashedPassword = await Captain.hashPassword(password)

  const captain = await createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    password: hashedPassword,
    email,
    color: vechile.color,
    plate: vechile.plate,
    capacity: vechile.capacity,
    vechileType: vechile.vechileType
  })

  if (!captain) {
    throw new ApiError(401, "Something is sent wrong")
  }

  const token = await captain.generateAuthToken()

  return res.status(200).json(
    new ApiResponse(200, "Captain created Successfully", { token, captain })
  )

})

const loginCaptain = asyncHandler(async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() })
  }

  const { email, password } = req.body

  const captain = await Captain.findOne({ email }).select('+password')


  if (!captain) {
    throw new ApiError(401, "Invalid Email or password ")
  }

  const isMatch = await captain.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, "Invalid password ")

  }

  const token = await captain.generateAuthToken()

  res.cookie('token', token)

  return res.status(200).json(
    new ApiResponse(200, "Captain Login Successfully", { token, captain })
  )


})

const getCaptainProfile = asyncHandler(async (req, res, next) => {
  const captain = req.captain

  return res.status(200).json(
    new ApiResponse(200, "got captain profile ", { captain })
  )
})

const logoutCaptain = asyncHandler(async (req, res, next) => {
  res.clearCookie('token')

  const token = req.cookies?.token || req.headers.authorization.split(' ')[1]

  await BlackListToken.create({ token })

  return res.status(200).json(
    new ApiResponse(200, "Captain LogOut ")
  )
})





export {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain

}


