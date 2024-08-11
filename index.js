import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as DB from "./config/db.js"; // connect to DB do not delete

// routes
import BlogRouter from "./routers/BlogRouter.js";
import PortfolioRouter from "./routers/PortfolioRouter.js";
import PromocodeRouter from "./routers/PromocodeRouter.js";
import PricesRouter from "./routers/PriceRouter.js";
import AuthRouter from "./routers/AuthRouter.js";

const app = express();
const PORT = 5555;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
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

// prices
app.use("/prices", PricesRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});
