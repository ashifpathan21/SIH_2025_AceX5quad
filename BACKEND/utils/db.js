import mongoose from 'mongoose' ;
import {config } from 'dotenv' ;
config() ;


const MONGO_URI = process.env.MONGO_URI ;
console.log(MONGO_URI)
export const connect = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Could not connect to Database");
        console.log(error);
        process.exit(1);
    }
    
} 