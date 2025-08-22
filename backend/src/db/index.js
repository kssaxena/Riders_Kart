// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URL}/${process.env.DB_Name}`
//     );
//     console.log(
//       `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("MONGODB connection FAILED ", error);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import { DeliveryPartner } from "../models/delivery-partner.model.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_Name}`
    );

    console.log(
      `\n✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );

    // Ensure indexes for DeliveryPartner model
    await DeliveryPartner.init();
    console.log("✅ DeliveryPartner indexes ensured");
  } catch (error) {
    console.log("❌ MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
