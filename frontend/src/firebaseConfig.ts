import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSXWvjWb1-Fchmy4EpwriktTQWGWG_yZw",
  authDomain: "job-compass-12c91.firebaseapp.com",
  projectId: "job-compass-12c91",
  storageBucket: "job-compass-12c91.firebasestorage.app",
  messagingSenderId: "601158408495",
  appId: "1:601158408495:web:a65e85b119ee7750b569da",
  measurementId: "G-Z7V6MMM9X9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Facebook Sign-In Error:", error);
  }
};

export {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signInWithGoogle,
  signInWithFacebook,
};
