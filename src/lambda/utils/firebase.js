const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
// Firebase ne doit être instancié qu'une fois.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// CommonJS
module.exports.db  = admin.firestore();
module.exports.collection = admin.firestore().collection('dynamic_links');
