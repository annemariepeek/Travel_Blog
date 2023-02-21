const http = require("http");
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
process.stdin.setEncoding("utf8");


const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const { MongoClient, ServerApiVersion } = require('mongodb');
const { rawListeners } = require("process");
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let inital_path = path.join(__dirname, "public")

const app = express()
app.use(express.static(inital_path))

app.get('/', (request, response) => {
    response.sendFile(path.join(inital_path, "uploads/home.html"))
})

app.get('/editor', (request, response) => {
    response.sendFile(path.join(inital_path, "uploads/editor.html"))
})

app.listen("5001", () => {
    console.log('listening.....')
})
