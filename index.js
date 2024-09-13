import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as DB from "./config/db.js"; // connect to DB do not delete

// routes
import BlogRouter from "./routers/BlogRouter.js";
import PortfolioRouter from "./routers/PortfolioRouter.js";
import PromocodeRouter from "./routers/PromocodeRouter.js";
import PricesRouter from "./routers/PriceRouter.js";
import FullPricesRouter from "./routers/FullPricesRouter.js";
import AuthRouter from "./routers/AuthRouter.js";
import PaymentRouter from "./routers/PaymentRouter.js";

const app = express();
const PORT = 4550;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3004", "https://siegtagsound.com"], // Масив дозволених доменів
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (_req, res) => {
  res.send("Welcome to API");
});

// auth
app.use("/api/auth", AuthRouter);

// blogs
app.use("/api/blogs", BlogRouter);
app.use("/api/payments", PaymentRouter);

// portfolio
app.use("/api/portfolios", PortfolioRouter);

// promocode
app.use("/api/promocodes", PromocodeRouter);

// prices
app.use("/api/prices", PricesRouter);

// full prices
app.use("/api/full-prices", FullPricesRouter);

app.use("/api/payment", PaymentRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log(`Server is running on port: ${PORT}`);
});
