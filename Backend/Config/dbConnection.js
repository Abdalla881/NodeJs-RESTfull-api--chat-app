import mongoose from "mongoose";

const dbConnection = mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log(`Database connected  `);
});

export default dbConnection;
