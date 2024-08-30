import express from "express";
import crypto from "crypto";
import { sendMessage } from "../utils/telegramService.js";

const router = express.Router();

const merchantAccount = "185_233_117_23";
const secretKey = "267aae68e0ac4bd13e7f64a32de2996361da8cb0";
const merchantDomainName = "185.233.117.23:3000";

function generateSignature(params, secretKey) {
  const dataString = params.join(";");
  return crypto.createHmac("md5", secretKey).update(dataString).digest("hex");
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
  } = req.body;

  const signatureParams = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice,
  ];

  const merchantSignature = generateSignature(signatureParams, secretKey);

  const paymentData = {
    merchantAccount: merchantAccount,
    merchantAuthType: "SimpleSignature",
    merchantDomainName: merchantDomainName,
    merchantSignature: merchantSignature,
    orderReference: orderReference,
    orderDate: orderDate,
    amount: amount,
    currency: currency,
    productName: productName,
    productCount: productCount,
    productPrice: productPrice,
    serviceUrl: "http://185.233.117.23:5555/payment/service-url",
  };

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

  const signatureParams = [
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
  ];

  const receivedSignature = req.body.merchantSignature;
  const calculatedSignature = generateSignature(signatureParams, secretKey);

  if (
    receivedSignature === calculatedSignature &&
    transactionStatus === "Approved"
  ) {
    console.log(`Оплата пройшла успішно! Номер замовлення: ${orderReference}`);

    const productName = req.body.productName;
    const clientName =
      req.body.clientFirstName + " " + (req.body.clientLastName || "");

    await sendMessage(
      `Оплата пройшла успішно! Продукт: ${productName.join(
        ", "
      )}. Оплачено клієнтом: ${clientName}.`
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
    res.status(400).send("Invalid signature or payment failed");
  }
});

export default router;
