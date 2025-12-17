import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,)
        console.log("Mongo db connected",conn.connection.host);
    } catch (error) {
        console.error("Error in DB connection",error);
        process.exit(1);
    }
}

export default {connect};