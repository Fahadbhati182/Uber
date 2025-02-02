import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const captainSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be atleast 5 characters long"],
      index: true
    },
    lastName: {
      type: String,
      minlength: [3, "Second name must be atleast 5 characters long"]
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be atleast six character long"],
    select: false
  },

  socketID: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },

  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'color must be of 3 characters']
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'plate must be of 3 characters']
    },
    capacity: {
      type: Number,
      required: true,
      minlength: [1, 'Capacity must be atleast 1']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'auto', 'motorcycle']
    }
  },

  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number
    }
  }

}, { timestamps: true })


captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN, { expiresIn: '24h' })
  return token
}

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)

}



export const Captain = mongoose.model("Captain", captainSchema)