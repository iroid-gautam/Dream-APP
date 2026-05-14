import path from "path";
import fs from "fs";
import admin from "firebase-admin";
import logger from "../logger";

const firebaseLogger = logger.withLabel("FIREBASE");
const serviceAccountPath = path.join(
  process.cwd(),
  "firebase-adminsdk.json"
);

let messagingInstance = null;

const initializeFirebase = () => {
  if (messagingInstance) {
    return messagingInstance;
  }

  if (!admin.apps.length) {
    try {
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(
          `Firebase service account file not found at path: ${serviceAccountPath}`
        );
      }

      const serviceAccount = require(serviceAccountPath);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      firebaseLogger.info("Firebase admin initialized successfully.", {
        projectId: serviceAccount.project_id || null,
      });
    } catch (error) {
      firebaseLogger.error("Firebase admin initialization failed.", {
        message: error?.message || "Unknown error",
        stack: error?.stack || null,
      });
      throw error;
    }
  }

  messagingInstance = admin.messaging();
  return messagingInstance;
};

const getFirebaseMessaging = () => initializeFirebase();

export { initializeFirebase, getFirebaseMessaging };
