import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://boyskinny143:aad0trJHtcvOMwDs@cluster0.j2i5s.mongodb.net/"
  )
  .then(() => console.log("Database OK"))
  .catch((error) => console.log("Database ERROR", error));
