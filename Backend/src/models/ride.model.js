import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain'
  },
  pickup: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled", "onGoing", "Completed"],
    default: "pending"
  },
  duration: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  paymentID: {
    type: String
  },
  orderID: {
    type: String
  },
  signature: {
    type: String
  },
  otp: {
    type: String,
    select: false,
    required: true

  }
}, { timestamps: true })


export const Ride = mongoose.model('Ride', rideSchema)