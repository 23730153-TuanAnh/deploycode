import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCi4zyWsOQAwtgi9gDxZLmVpy3Um00GqNE",
    authDomain: "automatives.firebaseapp.com",
    projectId: "automatic",
    storageBucket: "automatives.appspot.com",
    messagingSenderId: "552162896171",
    appId: "1:552162896171:web:5465c84491548cefb9bd6e",
    measurementId: "G-CW4RY75F5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const imageDb = getStorage(app)