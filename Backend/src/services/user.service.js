import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const createUser = async ({ firstName, lastName, email, password }) => {

  if (!firstName || !password || !email) {
    throw new ApiError(401,'All Fields are required')
  }

  const user = await User.create({
    fullName: {
      firstName,
      lastName
    },
    email,
    password
  })

  return user
}

export { createUser }