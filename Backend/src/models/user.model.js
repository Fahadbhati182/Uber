import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
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
    minlength:[6,"Password must be atleast six character long"],
    select: false
  },

  socketID: {
    type: String
  }
}, { timestamps: true })


userSchema.methods.generateAuthTokens = function () {
  const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN)
  return token;
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10)
}


export const User = mongoose.model("User", userSchema)




