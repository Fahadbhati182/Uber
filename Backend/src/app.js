
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import connectDB from './db/db.js'
const app = express()


connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())



//! Routes handling

import userRouter from "./routes/user.routes.js"
import captainRouter from "./routes/captain.routes.js"
import mapRouter from "./routes/map.routes.js"
import rideRouter from "./routes/ride.routes.js"


app.use('/users', userRouter)
app.use('/captains', captainRouter)
app.use('/maps', mapRouter)
app.use('/rides', rideRouter)

export { app }
