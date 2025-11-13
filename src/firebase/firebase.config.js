import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDALOLksnx6P-oL0PWzBJO2pX9A_JX1q44",
    authDomain: "share-a-bite-482937.firebaseapp.com",
    projectId: "share-a-bite-482937",
    storageBucket: "share-a-bite-482937.firebasestorage.app",
    messagingSenderId: "282292975607",
    appId: "1:282292975607:web:a854795bb9f9fbb0eba0f2",
    measurementId: "G-HNT2TY0MVT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)