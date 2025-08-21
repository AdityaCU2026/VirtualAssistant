import user from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import genToken from "../config/token.js";


export const signUp = async (req,res)=>{
        try{
          const { name, email, password } = req.body;
          const existEmail = await user.findOne({ email });
          if (existEmail) {
            return res.status(400).json({ message: "Email already exists!" });
          }
          if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
          }
          const hasedPassword = await bcrypt.hash(password, 10);
          const newUser = new user({
            name,
            email,
            password: hasedPassword,
          });
          await newUser.save();
         const  token = await genToken(newUser._id);

         res.cookie("token",token,{
            httpOnly: true,
            maxAge:30*24*60*60*1000,
            sameSite:"strict",
            secure:false
         })

          return res.status(201).json(newUser);

        }
        catch(err){

           return res.status(500).json({ message: `sign up error: ${err.message}` });
        }
}

export const Login = async (req,res)=>{
        try{
          const {email, password } = req.body;
          const User = await user.findOne({ email });
          if (!User) {
            return res.status(400).json({ message: "Email does not exists!" });
          }
          const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password!" });
            }

         const  token = await genToken(User._id);

         res.cookie("token",token,{
            httpOnly: true,
            maxAge:30*24*60*60*1000,
            sameSite:"strict",
            secure:false
         })

         return res.status(200).json(User);

        }
        catch(err){

            return res.status(500).json({ message: `sign up error: ${err.message}` });
        }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ message: `Logout error: ${err.message}` });
    }
}