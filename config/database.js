const mongoose = require("mongoose");
mongoose.Promise = Promise;

// mongoose connection
const connectDB = async () => {
    try {
        const DB = `mongodb://127.0.0.1:27017/user`
        mongoose.connect(DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            autoIndex: true,
        })
        console.log("MongoDB Connected Successfully")
    }

    catch (err) {
        console.log("Error in connecting mongoose Db :", err)
    }
}

module.exports = connectDB;