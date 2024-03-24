import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzLK6CZjo7zs78rdmv3FRVCt73wTOTXfI",
  authDomain: "too-good-to-good.firebaseapp.com",
  databaseURL: "https://too-good-to-good-default-rtdb.firebaseio.com",
  projectId: "too-good-to-good",
  storageBucket: "too-good-to-good.appspot.com",
  messagingSenderId: "432044374374",
  appId: "1:432044374374:web:faf0980e2ee0f3667a30a7",
  measurementId: "G-8L3BV865GC"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

 const storage = getStorage(firebaseApp);




export { db, auth, storage };
