// src/app/firebase.config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBCReIKOqonp38Bn9XTBw6LjFCTxaRg0xk",
  authDomain: "projetointegrador-5ba70.firebaseapp.com",
  databaseURL: "https://projetointegrador-5ba70-default-rtdb.firebaseio.com",
  projectId: "projetointegrador-5ba70",
  storageBucket: "projetointegrador-5ba70.firebasestorage.app",
  messagingSenderId: "870499535270",
  appId: "1:870499535270:web:32cc6d04633b7e405be767",
  measurementId: "G-JPZSF8LV12"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar
export const auth = getAuth(app);
export const db = getDatabase(app);
