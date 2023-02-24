// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

const initializeApp = require('firebase/app')
// const initializeApp = require('firebase/app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH29jSExWLrYnJvy_8HuyB1MtX7CTnK6k",
  authDomain: "travel-87cc1.firebaseapp.com",
  projectId: "travel-87cc1",
  storageBucket: "travel-87cc1.appspot.com",
  messagingSenderId: "639418226137",
  appId: "1:639418226137:web:782ba4a8f467585c1f75c8"
};

// Initialize Firebase
// const db = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();