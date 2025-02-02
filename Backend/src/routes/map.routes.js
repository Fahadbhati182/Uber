import express from 'express'
import { authUser, authCaptain } from "../middlewares/auth.middleware.js"
import { getCoordinate, getDistanceTime ,getAutoCompletedSuggestions} from '../controllers/map.controller.js'
import { query } from 'express-validator'

const router = express.Router()


router.get('/get-coordinates',
  query('address').isLength({ min: 3 }),
  authUser, getCoordinate
)

router.get('/get-distance-time',
  query('origin').isLength({ min: 3 }),
  query('destination').isLength({ min: 3 }),
  authUser, getDistanceTime
)

router.get('/get-suggestions',
  query('input').isLength({ min: 3 }),
  authUser, getAutoCompletedSuggestions

)


export default router