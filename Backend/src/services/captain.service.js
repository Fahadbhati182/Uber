import { Captain } from "../models/captain.model.js";
import ApiError from "../utils/ApiError.js";

const createCaptain = async (
  {
    firstName,
    lastName,
    password,
    email,
    color,
    plate,
    capacity,
    vechileType
  }
) => {

  if (!firstName || !lastName || !password || !email || !color || !plate || !capacity || !vechileType) {
    throw new ApiError(401, "All fields are requried")
  }

  const captain = await Captain.create({
    fullName: {
      firstName,
      lastName
    },
    email,
    password,
    vechile: {
      color,
      plate,
      capacity,
      vechileType
    }
  })

  return captain

}

export default createCaptain