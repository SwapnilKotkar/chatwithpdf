import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyC2m2sM3nSyFiCcf3TzRO9erbWf7KzKho8",
	authDomain: "next-chatwithpdf-4497b.firebaseapp.com",
	projectId: "next-chatwithpdf-4497b",
	storageBucket: "next-chatwithpdf-4497b.appspot.com",
	messagingSenderId: "722486788047",
	appId: "1:722486788047:web:8c755f7e12e84f0e3fdcba",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
