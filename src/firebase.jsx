// src/firebase.js (hoặc tạo một tệp tương tự)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACOaWdAes3Mt7RDIZuJim_mMHgVusKy-0",
  authDomain: "coinproject-ccffc.firebaseapp.com",
  projectId: "coinproject-ccffc",
  storageBucket: "coinproject-ccffc.appspot.com",
  messagingSenderId: "864368003115",
  appId: "1:864368003115:web:2bf2beb11b0fae2ecf426e"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
