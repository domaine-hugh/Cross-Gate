import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiX4h3spju_dHfW_IAnov5-JkzWAEfaJM",
  authDomain: "pokemon-fun-669cb.firebaseapp.com",
  projectId: "pokemon-fun-669cb",
  storageBucket: "pokemon-fun-669cb.firebasestorage.app",
  messagingSenderId: "837100025993",
  appId: "1:837100025993:web:058cf171468994d5982e58",
  measurementId: "G-47EL3P7W1K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  window.location.reload();
});

export { auth, db };
