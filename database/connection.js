import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const conn=process.env.mongoDB_URI

const connectToDB=()=>{
   try {
    mongoose.connect(conn)
    console.log("mongoDB connected successfully")
   } catch (error) {
    console.log(error)
   }
}

export default connectToDB