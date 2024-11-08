import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    required:true
   
  },
  otp:{
    type:String
  },
  otpVerified:{
    type:Boolean,
    default:false
  }
},
{timestamps:true})

export const User= mongoose.model("User",userSchema)

