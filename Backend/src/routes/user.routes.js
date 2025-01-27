import express from 'express'
import { body } from 'express-validator'
import { registerUser } from '../controllers/user.controller.js'


const router = express.Router();

router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullName.firstName').isLength({ min: 3 }).withMessage("First name must be at least 5 characters long"),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least six characters long")
], registerUser)



export default router