import express from "express";
import cors from "cors";
import * as DB from "./config/db.js";

// routes
import BlogRouter from "./routers/BlogRouter.js";
import PortfolioRouter from "./routers/PortfolioRouter.js";
import PromocodeRouter from "./routers/PromocodeRouter.js";
import AuthRouter from "./routers/AuthRouter.js";

const app = express();
const PORT = 5555;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to API");
});

// auth
app.use("/auth", AuthRouter);

// blogs
app.use("/blogs", BlogRouter);

// portfolio
app.use("/portfolios", PortfolioRouter);

// promocode
app.use("/promocodes", PromocodeRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});
