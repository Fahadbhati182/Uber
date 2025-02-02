import { validationResult } from "express-validator";
import { confirmRide, createRide, endRide, getFare, startRide } from "../services/ride.service.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import { getAddressCoordinates, getCaptainInRadius } from "../services/map.service.js";
import { sendMessageToSocket } from "../socket.js";
import { Ride } from "../models/ride.model.js";



const createUberRide = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error) {
    return res.status(400).json({ error: error.array() })
  }
  const { pickup, destination, vehicleType } = req.body


  try {
    const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType })

    const pickUpCoordinate = await getAddressCoordinates(pickup)
    const captainInRadius = await getCaptainInRadius(pickUpCoordinate.lat, pickUpCoordinate.lng, 10)
    ride.otp = ""
    const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user')

    captainInRadius.map(cap => {
      sendMessageToSocket(cap.socketID, {
        event: 'new-ride',
        data: rideWithUser
      })
    })

    return res.status(200).json({ ride })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
})


const getUberFare = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }

  const { pickup, destination } = req.query


  try {
    const fare = await getFare(pickup, destination)
    return res.status(200).json(fare)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

const confirmUberRide = asyncHandler(async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }
  const { rideId, } = req.body

  try {
    const ride = await confirmRide({ rideId, captain: req.captain })
    sendMessageToSocket(ride.user.socketID, {
      event: 'ride-confirmed',
      data: ride
    })
    res.status(200).json(ride)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

})

const startUberRide = asyncHandler(async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }

  const { rideId, otp } = req.query

  try {
    const ride = await startRide({ rideId, otp, captain: req.captain })

    sendMessageToSocket(ride.user.socketID, {
      event: 'ride-started',
      date: ride
    })
    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message })
  }

})


const endUberRide = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await endRide({ rideId, captain: req.captain });

    sendMessageToSocket(ride.user.socketID, {
      event: 'ride-ended',
      data: ride
    })
    return res.status(200).json(ride);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})


export { createUberRide, getUberFare, confirmUberRide, startUberRide, endUberRide }