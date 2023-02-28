const http = require("http");
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const fileupload = require('express-fileupload');
process.stdin.setEncoding("utf8");
let initial_path = path.join(__dirname, "src");

require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
// const { LexModelBuildingService } = require("aws-sdk");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const app = express()
app.use(express.static(initial_path));
app.use(fileupload());
app.set("views", path.resolve(__dirname, "src/templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));


// const userName = process.env.MONGO_DB_USERNAME;
// const password = process.env.MONGO_DB_PASSWORD;

// const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// const db = require("./src/js/database")
// const client = require("./src/js/database")

// import { db, client } from "./src/js/database"

// import * as path from 'path';
// import * as express from 'express';
// import * as fileupload from 'express-fileupload';

// import { fileURLToPath } from 'url';

// const __filenamenpm = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);







const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];



app.get('/', (req, res) => {
    // res.sendFile(path.join(initial_path, "templates/home.ejs"))
    res.render("home")
})

app.get('/editor', (req, res) => {
    res.render("editor")
    // res.sendFile(path.join(initial_path, "uploads/editor.html"))
})

app.get('/upload', (req, res) => {
    res.sendFile(path.join(initial_path, "uploads/editor.html"))
})

app.listen("3000", () => {
    console.log('listening.....')
})

// upload link
app.post('/upload', (req, res) => {
    console.log("in upload endpoint")
    const {
        title, country, place, food_rating, saftey_rating, 
        cost_rating, accessibility_rating, author, article, banner_path
    } = req.body

    console.log(banner_path)
    
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let blogTitle = title.split(" ").join("-");
    let id = '';
    for(let i = 0; i < 4; i++){
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    // setting up docName
    let docName = `${blogTitle}-${id}`;
    let date = new Date(); // for published at info
    
    const blog_post = {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
        comments: {}
    }
    console.log(blog_post)

    async function addBlogPostToDB() {
        try {
            await client.connect();
           
            // add blog post to DB
            await client.db(db.db).collection(db.collection).insertOne(blog_post);
    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    // addBlogPostToDB().catch(console.error);
    res.sendFile(path.join(initial_path, "uploads/blog.html"))

})

app.get("/blog/:blogId", (req, res) => {
    const blogId = request.params.blogId

    const {
        docName: docName,
        title: title,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: publishedAT,
        comments: {}
    } = getBlogById(blogId)



    res.sendFile(path.join(initial_path, "uploads/blog.html"))

})

app.post("/upload_image", (req, res) => {
    let file = req.files.image;
    let date = new Date();

    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let path = 'src/images/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if(err){
            throw err;
        } else{
            // our image upload path
            res.json(`images/${imagename}`)
        }
    })
})


async function getBlogById(blogId) {
    async function lookUpBlog() {
        
        try {
            await client.connect();
                    
            let filter = { docName: blogId };
            const result = await client.db(databaseAndCollection.db)
                                .collection(databaseAndCollection.collection)
                                .findOne(filter);
        
           if (result) {
               return result;
           } else {
               console.log(`No email found with name ${email}`);
           }
                    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    lookUpBlog().catch(console.error);

}

// new approach 
