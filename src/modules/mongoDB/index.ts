import mongoose from "mongoose";

const connectMongoDB = async() => {
    
    await mongoose.connect(process.env.MONGO_DB);

}

export default connectMongoDB;