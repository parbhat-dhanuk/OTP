import express from "express"
import { forgetPassword, login, register, resetPassword, verifyOTP } from "../controllers/userController.js"

const router=express.Router()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgetPassword').post(forgetPassword)
router.route("/verifyotp").post(verifyOTP)
router.route("/resetpassword").post(resetPassword)
export default router