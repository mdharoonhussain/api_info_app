const redisClient = require("../helpers/redis");

const redisLimiter = async (req,res,next) => {
    const bool = await redisClient.exists(req.ip);
    if(bool === 1) {
        let no_request = await redisClient.get(req.ip);
        no_request = +no_request;

        if(no_request < 3) {
            redisClient.incr(req.ip);
            next();
        } else if(no_request === 3) {
            redisClient.expire(req.ip,21600);
            return res.send("Reached Maximum request please try again after 6 hours");
        } else {
            return res.send("Reached maximum request please try again after 6 hours");
        }
    } else {
        redisClient.set(req.ip,1);
        next();
    }
}
module.exports = redisLimiter;