import mongoose from "mongoose";
// import { seeder } from "../seeder";

require("dotenv").config();

const mongoConnection = () => {
    try {
        mongoose.set("strictQuery", false);
        console.log("MongoDB url: ", process.env.MONGO_DB_URL);
        mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }).then( () => {
            console.log("successfully connected!");
        }).catch( (err) => {
            console.log("MongoDB connection error " + err);
        })
    } catch (e) {
        console.log("MongoDB connection Error");
    }
}

export default mongoConnection;
