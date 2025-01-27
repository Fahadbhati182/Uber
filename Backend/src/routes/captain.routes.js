import express from "express"
import { body } from "express-validator"
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js"
import { authCaptain } from "../middlewares/auth.middleware.js"


const router = express.Router()


router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullName.firstName').isLength({ min: 3 }).withMessage("First name must be at least 5 characters long"),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least six characters long"),
  body('vechile.color').isLength({ min: 3 }).withMessage("color must be at least six characters long"),
  body('vechile.plate').isLength({ min: 3 }).withMessage("plate must be at least six characters long"),
  body('vechile.capacity').isLength({ min: 1 }).withMessage("capacity must be at least 1"),
  body('vechile.vechileType').isLength({ min: 3 }).withMessage("Invalid Vechile")
], registerCaptain)

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least six characters long"),
], loginCaptain)

console.log("In captain routes")
router.get('/profile', authCaptain, getCaptainProfile)

router.get('/logout', authCaptain, logoutCaptain)


export default router