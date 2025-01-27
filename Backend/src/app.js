
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import connectDB from './db/db.js'
const app = express()


connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))



import userRouter from "./routes/user.routes.js" 

app.use('/users',userRouter)

export { app }
