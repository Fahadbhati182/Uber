import { validationResult } from "express-validator"
import { getAddressCoordinates, getAddressDistanceTime, getAutoCompleteSuggestions } from "../services/map.service.js"

const getCoordinate = async (req, res, next) => {

  const error = validationResult(req)
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }

  const { address } = req.query

  try {
    const coordinates = await getAddressCoordinates(address)
    res.status(200).json(coordinates)
  } catch (error) {
    res.status(404).json({ message: 'Coordinate not found' })
  }
}


const getDistanceTime = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() })
    }

    const { origin, destination } = req.query

    const destinationTime = await getAddressDistanceTime(origin, destination)

    return res.status(200).json(destinationTime)

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })


  }
}


const getAutoCompletedSuggestions = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() })
    }

    const { input } = req.query

    const destinationTime = await getAutoCompleteSuggestions(input)

    return res.status(200).json(destinationTime)

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })


  }
}






export { getCoordinate, getDistanceTime ,getAutoCompletedSuggestions}