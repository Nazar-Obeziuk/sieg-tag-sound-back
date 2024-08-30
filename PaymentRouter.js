import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const merchantAccount = '185_233_117_23'; // Ваш Merchant login
const secretKey = '267aae68e0ac4bd13e7f64a32de2996361da8cb0'; // Ваш Merchant secret key
const merchantDomainName = '185.233.117.23:3000'; // Ваш домен

// Функція для генерації HMAC_MD5 підпису
function generateSignature(params, secretKey) {
    const dataString = params.join(';');
    return crypto.createHmac('md5', secretKey).update(dataString).digest('hex');
}

// Роут для ініціації платежу
app.post('/initiate-payment', (req, res) => {
    const {
        orderReference,
        orderDate,
        amount,
        currency,
        productName,
        productCount,
        productPrice
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
        ...productPrice
    ];

    const merchantSignature = generateSignature(signatureParams, secretKey);

    const paymentData = {
        merchantAccount: merchantAccount,
        merchantAuthType: 'SimpleSignature',
        merchantDomainName: merchantDomainName,
        merchantSignature: merchantSignature,
        orderReference: orderReference,
        orderDate: orderDate,
        amount: amount,
        currency: currency,
        productName: productName,
        productCount: productCount,
        productPrice: productPrice,
        // Додайте інші поля за потреби
    };

    // Відправка запиту на WayForPay
    res.json({
        actionUrl: 'https://secure.wayforpay.com/pay',
        paymentData: paymentData
    });
});

// Роут для обробки відповіді від WayForPay на serviceUrl
app.post('/service-url', (req, res) => {
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
        reasonCode
    ];

    const receivedSignature = req.body.merchantSignature;
    const calculatedSignature = generateSignature(signatureParams, secretKey);

    if (receivedSignature === calculatedSignature && transactionStatus === 'Approved') {
        // Платіж успішний, обробіть його тут
        res.json({
            orderReference: orderReference,
            status: 'accept',
            time: Math.floor(Date.now() / 1000),
            signature: generateSignature([orderReference, 'accept', Math.floor(Date.now() / 1000)], secretKey)
        });
    } else {
        // Платіж неуспішний або підпис некоректний
        res.status(400).send('Invalid signature or payment failed');
    }
});

// Запуск сервера
const PORT = 5555;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
