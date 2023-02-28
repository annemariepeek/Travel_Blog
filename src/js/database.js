const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../../credentialsDontPost/.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const { LexModelBuildingService } = require("aws-sdk");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// export { db, client }
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // const initializeApp = require('firebase/app')
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDH29jSExWLrYnJvy_8HuyB1MtX7CTnK6k",
//   authDomain: "travel-87cc1.firebaseapp.com",
//   projectId: "travel-87cc1",
//   storageBucket: "travel-87cc1.appspot.com",
//   messagingSenderId: "639418226137",
//   appId: "1:639418226137:web:af2d5b1423bfb3161f75c8"
// };

// // Initialize Firebase
// const db = initializeApp(firebaseConfig);

// export { db }