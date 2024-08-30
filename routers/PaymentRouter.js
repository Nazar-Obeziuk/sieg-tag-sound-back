// import express from 'express';
// import crypto from 'crypto';

// const router = express.Router();

// const merchantAccount = '185_233_117_23';
// const secretKey = '267aae68e0ac4bd13e7f64a32de2996361da8cb0';
// const merchantDomainName = '185.233.117.23:3000';

// function generateSignature(params, secretKey) {
//     const dataString = params.join(';');
//     return crypto.createHmac('md5', secretKey).update(dataString).digest('hex');
// }

// router.post('/initiate-payment', (req, res) => {
//     const {
//         orderReference,
//         orderDate,
//         amount,
//         currency,
//         productName,
//         productCount,
//         productPrice
//     } = req.body;

//     const signatureParams = [
//         merchantAccount,
//         merchantDomainName,
//         orderReference,
//         orderDate,
//         amount,
//         currency,
//         ...productName,
//         ...productCount,
//         ...productPrice
//     ];

//     const merchantSignature = generateSignature(signatureParams, secretKey);

//     const paymentData = {
//         merchantAccount: merchantAccount,
//         merchantAuthType: 'SimpleSignature',
//         merchantDomainName: merchantDomainName,
//         merchantSignature: merchantSignature,
//         orderReference: orderReference,
//         orderDate: orderDate,
//         amount: amount,
//         currency: currency,
//         productName: productName,
//         productCount: productCount,
//         productPrice: productPrice,
//     };

//     res.json({
//         actionUrl: 'https://secure.wayforpay.com/pay',
//         paymentData: paymentData
//     });
// });

// router.post('/service-url', (req, res) => {
//     const {
//         merchantAccount,
//         orderReference,
//         amount,
//         currency,
//         authCode,
//         cardPan,
//         transactionStatus,
//         reasonCode,
//         ...otherParams
//     } = req.body;

//     const signatureParams = [
//         merchantAccount,
//         orderReference,
//         amount,
//         currency,
//         authCode,
//         cardPan,
//         transactionStatus,
//         reasonCode
//     ];

//     const receivedSignature = req.body.merchantSignature;
//     const calculatedSignature = generateSignature(signatureParams, secretKey);

//     if (receivedSignature === calculatedSignature && transactionStatus === 'Approved') {
//         res.json({
//             orderReference: orderReference,
//             status: 'accept',
//             time: Math.floor(Date.now() / 1000),
//             signature: generateSignature([orderReference, 'accept', Math.floor(Date.now() / 1000)], secretKey)
//         });
//     } else {
//         res.status(400).send('Invalid signature or payment failed');
//     }
// });

import express from "express";
import crypto from "crypto";
import { sendMessage } from "../utils/telegramService.js"; // Імпорт функції для відправки повідомлень в Telegram

const router = express.Router();

const merchantAccount = "185_233_117_23";
const secretKey = "267aae68e0ac4bd13e7f64a32de2996361da8cb0";
const merchantDomainName = "185.233.117.23:3000";

function generateSignature(params, secretKey) {
  const dataString = params.join(";");
  return crypto.createHmac("md5", secretKey).update(dataString).digest("hex");
}

const orderDataStorage = {};

// router.post("/initiate-payment", (req, res) => {
//   const {
//     orderReference,
//     orderDate,
//     amount,
//     currency,
//     productName,
//     productCount,
//     productPrice,
//     cartData,
//   } = req.body;

//   const signatureParams = [
//     merchantAccount,
//     merchantDomainName,
//     orderReference,
//     orderDate,
//     amount,
//     currency,
//     ...productName,
//     ...productCount,
//     ...productPrice,
//   ];

//   const merchantSignature = generateSignature(signatureParams, secretKey);

//   // Зберігаємо дані про замовлення в пам'яті сервера
//   orderDataStorage[orderReference] = { cartData, amount };

//   const paymentData = {
//     merchantAccount: merchantAccount,
//     merchantAuthType: "SimpleSignature",
//     merchantDomainName: merchantDomainName,
//     merchantSignature: merchantSignature,
//     orderReference: orderReference,
//     orderDate: orderDate,
//     amount: amount,
//     currency: currency,
//     productName: productName,
//     productCount: productCount,
//     productPrice: productPrice,
//   };

//   res.json({
//     actionUrl: "https://secure.wayforpay.com/pay",
//     paymentData: paymentData,
//   });
// });

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

  // Зберігаємо дані про замовлення в пам'яті сервера
  orderDataStorage[orderReference] = { cartData, amount };

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
    serviceUrl: "http://185.233.117.23:5555/payment/service-url", // Додаємо serviceUrl
  };

  res.json({
    actionUrl: "https://secure.wayforpay.com/pay",
    paymentData: paymentData,
  });
});

router.post("/service-url", async (req, res) => {
  console.log("Received payment notification:", req.body); // Лог для перевірки запиту
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
    console.log("Payment approved:", orderReference); // Лог для перевірки успішної оплати

    // Отримуємо збережені дані про замовлення
    const orderData = orderDataStorage[orderReference];
    if (orderData) {
      const parsedCart = JSON.parse(orderData.cartData);
      const descriptions = parsedCart.descriptions || [];
      const driveLink = parsedCart.driveLink || "";

      const descriptionText = descriptions
        .map((desc, index) => `${index + 1}. ${desc}`)
        .join("\n\n");

      const message = `
                Прізвище та ім'я: ${parsedCart.firstName}
                Телефон: ${parsedCart.phone}
                Електронна пошта: ${parsedCart.email}
                Сервіс: ${parsedCart.service.label}
                Категорія: ${parsedCart.category}
                Посилання на диск: ${driveLink ? driveLink : "Немає"}
                Промокод: ${parsedCart.promocode}
                Скидка: ${
                  parsedCart.discount > 0 ? parsedCart.discount : "Нема"
                }
                Галочка на облако: ${
                  parsedCart.agreeToTerms === "on" ? "Да" : "Ні"
                }
                Сумма замовлення: ${amount}
                Опис файлів:
                ${descriptionText}
            `;

      await sendMessage(message);
      console.log("Message sent to Telegram:", message); // Лог для перевірки відправки повідомлення

      // Видаляємо збережені дані після відправки повідомлення
      delete orderDataStorage[orderReference];
    }

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
    console.log("Payment failed or invalid signature:", orderReference); // Лог для перевірки відхиленої оплати
    res.status(400).send("Invalid signature or payment failed");
  }
});

export default router;
