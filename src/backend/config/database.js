const mongoose = require("mongoose");

const connect = async () => {
    try {
        const uri = process.env.MONGO_URI;
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(console.log("MongoDB connected")).catch((error) => console.error(error));
    } catch (error) {
        console.error(error);
        return error;
    }
};

module.exports = connect;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/