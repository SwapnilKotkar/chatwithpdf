import {
	getApp,
	getApps,
	cert,
	initializeApp,
	App,
	ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";

// const serviceKey = require("@/service_key.json");

const serviceAccount: ServiceAccount = {
	// type: "service_account",
	// project_id: process.env.FIREBASE_PROJECT_ID,
	// private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	// private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
	// client_email: process.env.FIREBASE_CLIENT_EMAIL,
	// client_id: process.env.FIREBASE_CLIENT_ID,
	// auth_uri: "https://accounts.google.com/o/oauth2/auth",
	// token_uri: "https://oauth2.googleapis.com/token",
	// auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	// client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	// universe_domain: "googleapis.com",
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	privateKey: process.env.FIREBASE_PRIVATE_KEY_ID,
	projectId: process.env.FIREBASE_PROJECT_ID,
};

let app: App;

if (getApps().length === 0) {
	app = initializeApp({
		credential: cert(serviceAccount),
	});
} else {
	app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
