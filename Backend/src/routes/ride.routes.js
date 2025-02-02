import express from "express"
import { body, query } from "express-validator"
import { createUberRide, getUberFare, confirmUberRide, startUberRide, endUberRide } from "../controllers/ride.controller.js"
import { authCaptain, authUser } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post('/create',
  authUser,
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination'),
  body('vehicleType').isString().isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid pickup address'),
  createUberRide
)

router.get('/get-fare',
  query('pickup').isLength({ min: 3 }).withMessage('Invalid pickup address'),
  query('destination').isLength({ min: 3 }).withMessage('Invalid destination address'),
  authUser, getUberFare
)

router.post('/confirm',
  authCaptain,
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  confirmUberRide
)


router.get('/start-ride',
  authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
  startUberRide
)

router.post('/end-ride',
  authCaptain,
  body('rideId').isMongoId().withMessage('Invalid Id'),
  endUberRide
)


export default router