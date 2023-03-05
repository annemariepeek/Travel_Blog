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
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri)

const app = express()
app.use(express.static(initial_path));
app.use(fileupload());
app.set("views", path.resolve(__dirname, "src/templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

app.get('/', (req, res) => {
    s = ``
    async function buildHomePage() {
        try {
            await client.connect();
            
            const result = await client.db(db.db).collection(db.collection).find().toArray()

            result.forEach(function(post) {
                const { bannerImage, title, article, docName } = post

                s += `<div class="blog-card">
                <img src="${bannerImage}" class="blog-image" alt="">
                <h1 class="blog-title">${title.substring(0, 100) + '...'}</h1>
                <p class="blog-overview">${article.substring(0, 200) + '...'}</p>
                <a href="/blog/?id=${docName}" class="btn dark">read</a>
                </div>`
                    
            })
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
})

app.get('/temp/delete', (req, res) => {
    async function removeAllApplications() {
        
        try {
            await client.connect();
            const result = await client.db(db.db)
            .collection(db.collection)
            .deleteMany({});

            res.render("editor")

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    removeAllApplications().catch(console.error);
})

app.get("/blog/", (req, res) => {
    async function getBlog() {

        const blogId = req.query.id

        try {
            // retrieve blog post from db
            const post  = await getBlogById(blogId)

            // create formatted comments string
            post.comments = await format_comments(post.comments)
            res.render("blog", post)
            
        } catch (e) {
            console.log("error retrieving blog post");
        }   
    }
    getBlog().catch(console.error);
})

// upload link
app.post('/upload', (req, res) => {

    const {
        title, country, place, food_rating, saftey_rating, 
        cost_rating, accessibility_rating, author, article, banner_path
    } = req.body
    
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

    async function addBlogPostToDB() {
        try {
            await client.connect();
           
            // add blog post to DB
            await client.db(db.db).collection(db.collection).insertOne(blog_post);

            // 301 permanently redirect 
            res.writeHead(301, {
                Location: `/blog/?id=${docName}`
            }).end();
    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    addBlogPostToDB().catch(console.error);
})

app.post("/post_comment", (req, res) => {
    const {
        comment_author, email, comment, blogId
    } = req.body

    console.log("blog id " + blogId)

    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let commentTitle = comment_author.split(" ").join("-");
    let id = '';
    for(let i = 0; i < 4; i++){
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    // setting up docName
    let comment_id = `${commentTitle}-${id}`;
    console.log("new comment id: " + comment_id)

    const date = new Date()
    const new_comment = {
        comment_id: comment_id,
        comment_author: comment_author,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`, 
        email: email, 
        comment: comment,
        likes: 0
    }

    async function addComment() {
        try {
            await client.connect();
                    
            await client.db(db.db).collection(db.collection).updateOne(
                                    { docName: blogId },
                                    { $push: { comments: new_comment }})

            // 301 permanently redirect 
            res.writeHead(301, {
                Location: `/blog/?id=${blogId}`
            }).end();

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    addComment().catch(console.error);
})

app.post('/upvote_comment', (req, res) => {
    const {blogId, commentId} = req.body
    console.log(blogId )
    console.log(commentId)


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

app.listen("3000", () => {
    console.log('listening.....')
})

async function getBlogById(blogId) {
    try {
        await client.connect();
        const result = await client.db(db.db)
                            .collection(db.collection)
                            .findOne({ docName: blogId })

        if (result) {
            return result
        } else {
            console.log(`error in get blog by id`)
        }    
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function format_comments(comments) {
    str = ``
    if (comments.length === 0) { str += `Be the first to leave a comment.`}
    comments.forEach((c) => {
        const {
            comment_id, comment_author, comment, publishedAt
        } = c


        str += `<div class="single_comment">
            <h4 class="comment_author"> ${comment_author} </h4>
            <h6> ${publishedAt} </h6>
            ${comment}
            ${comment_id}
            <br>
            <h7 name="likes" id="likes"></h7> 
            <button onclick="upvote()" id="likes_btn" class="likes_btn"><img src="../img/thumbsup.png" alt="like comment"></button>
            <button id="reply_btn" class='reply'>Reply</button>
            <input type="hidden" id="commentId" value="${comment_id}"/>
            </div>
            <hr>`
    })
    return str
}
 
