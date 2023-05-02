const winston = require("winston")

const {mongoDB} = require("winston-mongodb")

const logger = winston.createLogger({
    level:"Info",
    format:winston.format.json(),
    transports:[
        new mongoDB ({
            db:process.env.MONGODB_URI,
            collection:"logs",
            options:{
                useUnifiedTopology:true
            }
        })
    ]
})

module.exports = logger;