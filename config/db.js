import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://admin-sieg-tag-sound:ZICuwh4mpXxZS9U4@cluster0.ro0otcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Database OK"))
  .catch((error) => console.log("Database ERROR", error));
