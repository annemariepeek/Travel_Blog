const http = require("http");
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const fileupload = require('express-fileupload');
process.stdin.setEncoding("utf8");

const userName = "annemariepeek"
const dbName = "TRAVEL_BLOG"
const password = "dRlpnXen5ycGIgWI"
const collection = "blog_posts"

const db = {db: dbName, collection: collection};
const { MongoClient, ServerApiVersion } = require('mongodb');
const { rawListeners } = require("process");
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
// const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const { rawListeners } = require("process");
// const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;

let initial_path = path.join(__dirname, "public");

const app = express()
app.use(express.static(initial_path));
app.use(fileupload());


app.get('/', (request, response) => {
    response.sendFile(path.join(initial_path, "uploads/home.html"))
})

app.get('/editor', (request, response) => {
    response.sendFile(path.join(initial_path, "uploads/editor.html"))
})

app.listen("5001", () => {
    console.log('listening.....')
})

// upload link
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let path = 'public/uploads/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if(err){
            throw err;
        } else{
            // our image upload path
            res.json(`uploads/${imagename}`)
        }
    })
})
