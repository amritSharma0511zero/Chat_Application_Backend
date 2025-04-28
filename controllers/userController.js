import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req,res) =>{
    try {
        const {fullName, userName, password, confirmPassword, gender} = req.body;
        if(!fullName || !userName || !password || !confirmPassword || !gender){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:"Password does not match"});
        }

        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({message:"username alreay exit try different"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        await User.create({
            fullName,
            userName,
            password:hashedPassword,
            profilePhoto: gender === "male"? maleProfilePhoto : femaleProfilePhoto,
            gender,
        })
        return res.status(201).json({
            message:"Account created successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req,res) => {
    try {
        const {userName, password} = req.body;
        if(!userName || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({userName});
        if(!user){
            return res.status(400).json({
                message:"Invalid username and password",
                success:false
            })
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(400).json({
                message:"Invalid username and password",
                success : false
            })
        }

        const tokenData={
            userId:user._id,
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn:'1d'});

        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000,httOnly:true,secure:true, sameSite:'strict'}).json({
            _id:user._id,

            userName:user.userName,
            fullName:user.fullName,
            profilePhoto:user.profilePhoto
        });
    } catch (error) {
        console.log(error);
    }
}

export const logout = (req, res) =>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export const getOtherUsers = async(req,res)=>{
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

