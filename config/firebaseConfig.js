import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "sieg-tag-sound.appspot.com",
});

const bucket = admin.storage().bucket();

export default bucket;
