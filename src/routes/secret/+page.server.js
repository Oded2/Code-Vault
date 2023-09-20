import { GCLOUD } from "$env/static/private";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: GCLOUD,
  authDomain: "code-vault-c5663.firebaseapp.com",
  databaseURL:
    "https://code-vault-c5663-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "code-vault-c5663",
  storageBucket: "code-vault-c5663.appspot.com",
  messagingSenderId: "74765715916",
  appId: "1:74765715916:web:657ef2ac13479130753569",
  measurementId: "G-FF0CTW4C4G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
