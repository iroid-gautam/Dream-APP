import admin from "firebase-admin";
const serverKey = require('../../../firebase-adminsdk.json');

export default admin.initializeApp({
    credential: admin.credential.cert(serverKey)
});