const jwt = require("jsonwebtoken");

const redisClient = require("../helpers/redis");

const authenticator = async (req,res,next) => {
    try{
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(400).send("Please login again!");

        const istokenValid = await jwt.verify(token,process.env.JWT_SECRET);
        if(!istokenValid) return res.send("Authentication failed, Please login again!!!");

        const isitokenBlacklisted = await redisClient.get(token);
        if(isitokenBlacklisted) return res.send("Unauthorized");
        
        res.body.userID = istokenValid.userId;
        res.body.preferred_city = istokenValid.preferred_city;
        next();
    } catch(err) {
        console.log(err.message)
        res.send(err.message);
    }
}

module.exports = {authenticator};