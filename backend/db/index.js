import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const ConnectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`Connected to host :${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error While Connecting to DataBase : ${error}`);
    process.exit(1);
  }
};

export default ConnectDb;
