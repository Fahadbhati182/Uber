import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsynHandler.js"
import { createUser } from "../services/user.service.js"
import { validationResult } from "express-validator"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() })
  }

  const { fullName, password, email } = req.body

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
    new ApiResponse(200, "User Registered Successfully",{ user, token })
  )
})


export {
  registerUser
}