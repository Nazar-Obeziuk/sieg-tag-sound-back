import express from "express";
import crypto from "crypto";
import { sendMessage } from "../utils/telegramService.js";

const router = express.Router();

const merchantAccount = "185_233_117_23";
const secretKey = "267aae68e0ac4bd13e7f64a32de2996361da8cb0";
const merchantDomainName = "185.233.117.23:3000";

// Middleware для обробки нестандартного формату JSON
router.use(express.json({ type: "application/json" }));

// Middleware для парсингу нестандартного JSON
router.use((req, res, next) => {
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length === 1 &&
    req.body[Object.keys(req.body)[0]] === ""
  ) {
    const rawBody = Object.keys(req.body)[0];
    try {
      req.body = JSON.parse(rawBody);
    } catch (error) {
      console.error("Error parsing JSON from request body:", error);
      return res.status(400).send("Invalid JSON format");
    }
  }
  next();
});

function generateSignature(params, secretKey) {
  console.log("params для підпису:", params);
  const dataString = params.join(";");
  console.log("dataString для підпису:", dataString);
  const signature = crypto
    .createHmac("md5", secretKey)
    .update(dataString)
    .digest("hex");
  console.log("Generated Signature:", signature);
  return signature;
}

router.post("/initiate-payment", (req, res) => {
  const {
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productCount,
    productPrice,
    cartData,
  } = req.body;

  let parsedCartData;
  try {
    parsedCartData = JSON.parse(cartData);
  } catch (error) {
    console.error("Error parsing cartData:", error);
    return res.status(400).send("Invalid cartData format");
  }

  const { email, phone } = parsedCartData;

  console.log("=== Initiate Payment Request ===");
  console.log("Received body:", req.body);
  console.log("Order Reference:", orderReference);
  console.log("Order Date:", orderDate);
  console.log("Amount:", amount);
  console.log("Currency:", currency);
  console.log("Product Names:", productName);
  console.log("Product Counts:", productCount);
  console.log("Product Prices:", productPrice);
  console.log("Email:", email);
  console.log("Phone:", phone);

  if (
    productName.length !== productCount.length ||
    productCount.length !== productPrice.length
  ) {
    console.error("Product data arrays have different lengths!");
    return res.status(400).send("Invalid product data");
  }

  const signatureParams = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    parseFloat(amount), // Конвертуємо суму в число
    currency,
    ...productName,
    ...productCount.map(Number), // Конвертуємо кількість у числа
    ...productPrice.map((price) => parseFloat(price)), // Конвертуємо ціни в числа
  ];

  const merchantSignature = generateSignature(signatureParams, secretKey);

  const paymentData = {
    merchantAccount: merchantAccount,
    merchantAuthType: "SimpleSignature",
    merchantDomainName: merchantDomainName,
    merchantSignature: merchantSignature,
    orderReference: orderReference,
    orderDate: orderDate,
    amount: parseFloat(amount), // Конвертуємо суму в число
    email: email,
    phone: phone,
    currency: currency,
    productName: productName,
    productCount: productCount.map(Number), // Конвертуємо кількість у числа
    productPrice: productPrice.map((price) => parseFloat(price)), // Конвертуємо ціни в числа
    serviceUrl: "http://185.233.117.23:5555/payment/service-url",
  };

  console.log("Generated Payment Data:", paymentData);

  res.json({
    actionUrl: "https://secure.wayforpay.com/pay",
    paymentData: paymentData,
  });
});

router.post("/service-url", async (req, res) => {
  const {
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
    ...otherParams
  } = req.body;

  console.log("=== Service URL Request ===");
  console.log("Received body:", req.body);
  console.log("Order Reference:", orderReference);
  console.log("Transaction Status:", transactionStatus);

  const signatureParams = [
    merchantAccount,
    orderReference,
    parseFloat(amount), // Конвертуємо суму в число
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
  ];

  const receivedSignature = req.body.merchantSignature;
  const calculatedSignature = generateSignature(signatureParams, secretKey);

  console.log("Received Signature:", receivedSignature);
  console.log("Calculated Signature:", calculatedSignature);

  if (
    receivedSignature === calculatedSignature &&
    transactionStatus === "Approved"
  ) {
    console.log(`Оплата пройшла успішно! Номер замовлення: ${orderReference}`);

    const clientName = req.body.clientName || "";

    await sendMessage(
      `Оплата пройшла успішно! Пошта: ${req.body.email}, Телефон: ${req.body.phone}, Сума: ${req.body.amount}, Клієнт: ${clientName}.`
    );

    res.json({
      orderReference: orderReference,
      status: "accept",
      time: Math.floor(Date.now() / 1000),
      signature: generateSignature(
        [orderReference, "accept", Math.floor(Date.now() / 1000)],
        secretKey
      ),
    });
  } else {
    console.error("Invalid signature or payment failed");
    res.status(400).send("Invalid signature or payment failed");
  }
});

export default router;
