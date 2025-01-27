import mongoose from "mongoose"

function connectDB() {
  mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Data Base Connected Succesfully"))
    .catch((err) => console.log("Data Base Connection failed", err))
}

export default connectDB