


import mongoose from "mongoose";
const { Schema, model } = mongoose; 

const otpSchema =new mongoose.Schema({
   // userId: String,  
    otp: String,
    createdAt: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now, expires: '3000s' } ,
   })
const Otp = mongoose.model('otp', otpSchema);

export default model("otp",otpSchema)
