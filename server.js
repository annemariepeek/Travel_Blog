const http = require("http");
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const fileupload = require('express-fileupload');

// import * as path from 'path';
// import * as express from 'express';
// import * as fileupload from 'express-fileupload';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);


process.stdin.setEncoding("utf8");

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

app.listen("3000", () => {
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
