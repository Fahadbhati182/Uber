import { Ride } from "../models/ride.model.js";
import { sendMessageToSocket } from "../socket.js";
import { getAddressDistanceTime } from "./map.service.js";
import crypto from 'crypto';


async function getFare(pickup, destination) {

  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required")
  }
  const distanceTime = await getAddressDistanceTime(pickup, destination)

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5
  };



  const fare = {
    auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
    car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
    moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
  };

  return fare;



}


function getOtp(num) {
  const otp = crypto.randomInt(10 ** (num - 1), 10 ** num).toString();
  return otp;
}


const createRide = async ({ user, pickup, destination, vehicleType }) => {

  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required")
  }

  console.log({ user, pickup, destination, vehicleType })

  const fare = await getFare(pickup, destination)

  const ride = await Ride.create({
    user: user,
    pickup: pickup,
    destination: destination,
    otp: getOtp(6),
    fare: fare[vehicleType]
  })

  return ride

}

const confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error('Ride is required')
  }

  console.log("captain", captain)

  await Ride.findByIdAndUpdate({
    _id: rideId
  }, {
    status: 'accepted',
    captain: captain._id
  })

  const ride = await Ride.findOne({
    _id: rideId,
  }).populate('user').populate('captain').select('+otp')

  if (!ride) {
    throw new Error('Ride not found')
  }

  return ride


}

const startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error('Ride id and OTP are required');
  }

  const ride = await Ride.findOne({
    _id: rideId,
    status: 'accepted'

  }).populate('user').populate('captain').select('+otp');

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (ride.status !== 'accepted') {
    throw new Error('Ride not accepted');
  }

  if (ride.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  await Ride.findOneAndUpdate({
    _id: rideId
  }, {
    status: 'ongoing'
  })

  sendMessageToSocket(ride.user.socketID, {
    event: 'ride-started',
    data: ride
  })

  return ride;
}


const endRide = async ({rideId,captain}) => {
  if (!rideId) {  
    throw new Error('Ride id is required');
  }

  const ride = await Ride.findOne({
    _id: rideId,
    captain: captain._id,
    status: 'ongoing'
  }).populate('user').populate('captain').select('+otp');

  if (!ride) {
    throw new Error('Ride not found');
  }

  if (ride.status !== 'ongoing') {
    throw new Error('Ride not ongoing');
  }

  await Ride.findOneAndUpdate({
    _id: rideId
  }, {
    status: 'completed'
  })

  return ride;
}

export { createRide, getFare, confirmRide, startRide, endRide }
