const user = require("../models/user.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../helpers/redis");

const signup = async (req,res) => {
    try{
        const {name,email,password,preferred_city} = req.body;
        const isUserPresent = await user.findOne({email});
        if(isUserPresent) return res.send("User already present, login first! ");
        const hash = await bcryptt.hash(password,5);
        const newUser = new user({name,email,password:hash,preferred_city});
        await newUser.save();
        res.send("Signup Successfully");
    } catch(err) {
       console.log(err.message)
    }
}

const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const isUserPresent = await user.findOne({email});
        if(!isUserPresent) return res.send("User not present, Register yourself first!!");
        const isPasswordCorrect = await bcrypt.compare(password,isUserPresent.password);
        if(!isPasswordCorrect) return res.send("Invalid Credentials");

        const token = await jwt.sign({userId:isUserPresent._id,preferred_city:isUserPresent.preferred_city},process.env.JWT_SECRET, {expiresIn:"6hr"});
        res.send({message: "login Successfully",token});

    } catch(err) {
     console.log(err.message)
     res.send(err.message);
    }
}

const logout = async (req,res) => {
    try{
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(400);

        await redisClient.set(token,token);
        res.send("Logout Successfully");
    } catch(err) {
        console.log(err.message)
        res.send(err.message);
    }
}

module.exports = {signup,login,logout};