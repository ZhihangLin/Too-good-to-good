import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjs8-deIJ5iZ50ekGxzG371oCgp8o5BOo",
  authDomain: "too-good-to-go-eb0ec.firebaseapp.com",
  projectId: "too-good-to-go-eb0ec",
  storageBucket: "too-good-to-go-eb0ec.appspot.com",
  messagingSenderId: "1031341208150",
  appId: "1:1031341208150:web:82f8d7d600841a47be01f7",
  measurementId: "G-JS444F4RH5"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

 const storage = getStorage(firebaseApp);




export { db, auth, storage };