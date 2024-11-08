import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {sendEmail} from "../utils/email.js"


export const register=async(req,res)=>{
    try {
        const {email,userName,phoneNumber,password}=req.body
        if(!email||!userName||!phoneNumber||!password){
            return res.status(401).json({
                message:"please provide email,userName,phoneNumber,password"
            })
        }
        const user=await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"try different email",
            })
        }
        const hashPassword=await bcrypt.hash(password,10)
        await User.create({
            email,
            userName,
            password:hashPassword,
            phoneNumber
        })
        return res.status(201).json({
            message:"Account created successfully",
        })
    } catch (error) {
        console.log(error)
    }
     
}




export const login=async (req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(401).json({
            message:"please provide email or password",
        })
    }
    const user=await User.findOne({email})
    if(!user){
        return res.status(401).json({
            message:"Incorrect email or password",
        })
    }

    const isPasswordMatch=await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            message:"Incorrect email or password"
        })
    }
   
    const token =await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
     // const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiredIn:"1d"})
    // return res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge:1*24*60*60*1000}).json({
    //     message:`Welcome${user.userName}`,
    //     data:user
    // })
    return res.status(200).json({
        message:"logged in successfully",
        token:token
    })
}


export const logout=async (_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:"logged out successfully",
        })
    } catch (error) {
        console.log(error)
    }
}


//Forget password(OTP)

export const forgetPassword=async (req,res)=>{
   try {
    const {email}=req.body
    if(!email){
        return res.status(401).json({
            message:"please provide email"
        })
    }
    //check if that email registered or not
    const userExist=await User.findOne({email})
    if(!userExist){
        return res.status(401).json({
            message:"Email is not registered"
        })
    }
    //  Send OTP to that email
   const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    userExist.otp=OTP
    await userExist.save()
   sendEmail({
    email:email,
    subject:"password reset",
    message:`OTP code is:${OTP} Don't share to anyone`
   })
   return res.status(200).json({
    message:"OTP sent successfully"
   })
   } catch (error) {
    console.log(error)
   }

}

//Verify OTP

export const verifyOTP= async(req,res)=>{
  try {
    const {email,otp}=req.body
    if(!email||!otp){
        return res.status(401).json({
            message:"Please provide email or OTP"
        })
    }
    //Check if that OTP email exist or not
    const userExist=await User.findOne({email})
if(!userExist){
    return res.status(401).json({
        message:"Email doesn't exist"
    })
}
if(userExist.otp!==otp){
return res.status(401).json({
    message:"Invalid OTP"
})
}
//dispost the OTP so cannot be used next time
userExist.otp=undefined
userExist.otpVerified=true
await userExist.save()
return res.status(200).json({
    message:"OTP matched"
})
  } catch (error) {
    console.log(error)
  }
}

//reset password

export const resetPassword=async(req,res)=>{
    try {
        const {email,newPassword,confirmPassword}=req.body
        if(!email||!newPassword||!confirmPassword){
            return res.status(401).json({
                message:"please provide email,newPassword,confirmPassword"
            })
        }
        if(newPassword!==confirmPassword){
            return res.status(401).json({
                message:"newPassword & confirmPasword doesn't match"
            })
        }
        const userExist=await User.findOne({email})
        if(!userExist){
            return res.status(401).json({
                message:"User Email is not registered"
            })
        }
        if(userExist.otpVerified!==true){
            return res.status(403).json({
                message:"You cannot perform this action"
            })
        }
        userExist.password=bcrypt.hashSync(newPassword,10)
        userExist.otpVerified=false
        await userExist.save()
        return res.status(201).json({
            message:"Password changed successfully"
        })
    } catch (error) {
        console.log(error)
    }
}