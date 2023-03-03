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
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri)

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
    s = ``

    async function buildHomePage() {
        try {
            await client.connect();
            
            const result = await client.db(db.db).collection(db.collection).find().toArray()
            for (r in result) {

                result.forEach(function(post) {
                    const { bannerImage, title, article, docName } = post

                    s += `<div class="blog-card">
                    <img src="${bannerImage}" class="blog-image" alt="">
                    <h1 class="blog-title">${title.substring(0, 100) + '...'}</h1>
                    <p class="blog-overview">${article.substring(0, 200) + '...'}</p>
                    <a href="/blog/${docName}" class="btn dark">read</a>
                    </div>`
                    
            })}

            // console.log(s)
            res.render("home", {posts: s})
            
        } catch (e) {
            console.log(`error in iterating over db`);
        } 
        finally {
            await client.close();
        }
        
    }buildHomePage().catch(console.error);
})

app.get('/editor', (req, res) => {
    res.render("editor")
    // res.sendFile(path.join(initial_path, "uploads/editor.html"))
})

app.get('/upload', (req, res) => {
    res.render("editor")
    // res.sendFile(path.join(initial_path, "uploads/editor.html"))
})

// app.get('/blog/:blogId', (req, res) => {
//     res.render("blog")
// }) // when refresh should pull up same blog

app.get("/blog/:blogId", (req, res) => {
    const blogId = req.params.blogId

    const {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        average_rating: average,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: publishedAt,
        comments: comments
    } = getBlogById(blogId)

    const formatted_comments = format_comments(comments)

    const blog_post = {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        average_rating: average,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: publishedAt,
        comments: formatted_comments
    }
    res.render("blog", blog_post)
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

    const average = (Number(food_rating) + Number(saftey_rating) + Number(cost_rating) + Number(accessibility_rating)) / 4
    
    const blog_post = {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        average_rating: average,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
        comments: []
    }
    // console.log(blog_post)

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
    addBlogPostToDB().catch(console.error);
    res.render("blog", blog_post)

})

app.post("/post_comment", (req, res) => {
    const {
        comment_author, email, comment, blogId
    } = req.body

    const date = new Date()
    const new_comment = {
        comment_author: comment_author,
        // publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`, 
        email: email, 
        comment: comment
    }

    // console.log(`get blog by id: ${blogId}`)

    async function addComment() {
        try {
            await client.connect();
                    
            const result = await client.db(db.db)
                                .collection(db.collection)
                                .updateOne(
                                    { docName: blogId },
                                    { $push: { comments: new_comment }}
                                )
        
           if (result) {
               return result;
           } else {
               console.log(`error in add comment`);
           }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    addComment().catch(console.error);

    const post = getBlogById(blogId)
    // console.log(post)

    const {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        average_rating: average,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: publishedAt,
        comments: comments
    } = getBlogById(blogId)

    const formatted_comments = format_comments(comments)

    const blog_post = {
        docName: docName,
        title: title,
        country: country,
        place: place,
        food_rating: food_rating,
        saftey_rating: saftey_rating,
        cost_rating: cost_rating,
        accessibility_rating: accessibility_rating,
        average_rating: average,
        article: article,
        author: author,
        bannerImage: banner_path,
        publishedAt: publishedAt,
        comments: formatted_comments
    }
    res.render("blog", blog_post)
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

async function buildHomePage() {

    console.log("iterating over db")
    s = ``

    try {

        await client.connect();
        
        const result = await client.db(db.db).collection(db.collection).find().toArray()
        for (r in result) {

            result.forEach(function(post) {
                const { bannerImage, title, article, docName } = post

                s += `<div class="blog-card">
                <img src="${bannerImage}" class="blog-image" alt="">
                <h1 class="blog-title">${title.substring(0, 100) + '...'}</h1>
                <p class="blog-overview">${article.substring(0, 200) + '...'}</p>
                <a href="/${docName}" class="btn dark">read</a>
                </div>`
                
        })}

        return s
          
    } catch (e) {
        console.log(`error in iterating over db`);
    } 
    finally {
        await client.close();
    }
}


async function getBlogById(blogId) {
    async function lookUpBlog() {
        
        try {
            await client.connect();
                    
            console.log(blogId)

            const result = await client.db(db.db)
                                .collection(db.collection)
                                .findOne({ docName: blogId });
        
           if (result) {
               return result;
           } else {
               console.log(`error in get blog by id`);
           }
                    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    // console.log("call lookup")
    lookUpBlog().catch(console.error);

}


async function format_comments(comments) {
    // c = ``
    
    // if (comments.length === 0) { c += `Be the first to leave a comment.`}
    
    // comments.forEach((c) => {
    //     const {
    //         comment_author, comment, publishedAt
    //     } = c
    //     c += `<div class="single_comment">
    //         <h4> ${comment_author} </h4><h6> ${publishedAt} </h6><br>
    //         ${comment}
    //         </div>`
    // })
    // return c
    // console.log(comments)
}
 
