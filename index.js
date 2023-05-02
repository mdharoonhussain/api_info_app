const express = require("express");
const connection = require("./config/db");
const {userRouter} = require("./routes/user.route");
const redisClient = require("./helpers/redis");
const cityRouter = require("./routes/city.route");

const logger = require("./middlewares/logger");

require("dotenv").config()

const PORT = process.env.PORT || 6500;
const app = express();
app.use(express.json())

app.get("/",async(req,res) => {
   res.send(await redisClient.get("name"));
})

app.use("/api/user",userRouter);
app.use("api/weather",cityRouter);

app.listen(PORT,async()=>{
    try{
        await connection();
        console.log("Connected to Database");
        logger.log("info","DB connected")
    } catch(err) {
         console.log(err.message)
        logger.log("error","DB connection failed!")

    }
    console.log("Server is running",PORT)
})