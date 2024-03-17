import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0XemPCkDKFytMBSdMwt-eWsdDiJhe8Cc",
  authDomain: "tgtg-af1a6.firebaseapp.com",
  projectId: "tgtg-af1a6",
  storageBucket: "tgtg-af1a6.appspot.com",
  messagingSenderId: "691724795327",
  appId: "1:691724795327:web:d9c889d30f7b122258f50a",
  measurementId: "G-TE01XPPRJ8"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

 const storage = getStorage(firebaseApp);




export { db, auth, storage };