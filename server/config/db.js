const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); // await used inside asynch function to pause the execution of the funciton until a promise is resolver
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Database not connected");
    console.log(error);
  }
};
module.exports = connectDB;
