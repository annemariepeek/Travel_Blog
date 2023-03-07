const http = require("http")
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
const fileupload = require('express-fileupload')
process.stdin.setEncoding("utf8")
let initial_path = path.join(__dirname, "src")

// db config
// require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
// const userName = process.env.MONGO_DB_USERNAME
// const password = process.env.MONGO_DB_PASSWORD
// // const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION}
// const { MongoClient } = require('mongodb')
// const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`
// const client = new MongoClient(uri)

const { db , client } = require('./db')
const console = require("console")

const app = express()
app.use(express.static(initial_path))
app.use(fileupload())
app.set("views", path.resolve(__dirname, "src/templates"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

app.get('/', (req, res) => {
    s = ``
    async function buildHomePage() {
        try {
            await client.connect()
            const result = await db.find().toArray()
            // const result = await client.db(db.db).collection(db.collection).find().toArray()


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
            console.log(`error in iterating over db`)
        } 
        finally {
            await client.close()
        }
    }buildHomePage().catch(console.error)
})

app.get('/country/', (req, res) => {
    const country = req.query.name
    s = ``
    async function buildHomePage() {
        try {
            await client.connect()
            
            // const result = await client.db(db.db).collection(db.collection).find({country : country}).toArray()
            const result = await db.find({country : country}).toArray()

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
            console.log(`error in iterating over db`)
        } 
        finally {
            await client.close()
        }
    }buildHomePage().catch(console.error)
})

app.get('/editor', (req, res) => {
    res.render("editor")
})

app.get('/temp/delete', (req, res) => {
    async function removeAllApplications() {
        
        try {
            await client.connect()
            await db.deleteMany({})

            res.render("editor")

        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    removeAllApplications().catch(console.error)
})

app.get("/blog/", (req, res) => {
    async function getBlog() {

        const blogId = req.query.id

        try {
            console.log("in get")
            // retrieve blog post from db
            const post  = await getBlogById(blogId)
            console.log("get blog ")
            post.article = await formatArticle(post.article)
            console.log("article formatted")
            post.comments = await formatComments(post.comments)

            res.render("blog", post)
            
        } catch (e) {
            console.log("error retrieving blog post")
        }   
    }
    getBlog().catch(console.error)
})

// upload link
app.post('/upload', (req, res) => {

    const {
        title, country, place, food_rating, saftey_rating, 
        cost_rating, accessibility_rating, author, article, banner_path
    } = req.body
    
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let blogTitle = title.split(" ").join("-")
    let id = ''
    for(let i = 0; i < 4; i++){
        id += letters[Math.floor(Math.random() * letters.length)]
    }
    // setting up docName
    let docName = `${blogTitle}-${id}`
    let date = new Date() // for published at info

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
            await client.connect()
           
            // add blog post to DB
            await db.insertOne(blog_post)

            // 301 permanently redirect 
            res.writeHead(301, {
                Location: `/blog/?id=${docName}`
            }).end()
    
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    addBlogPostToDB().catch(console.error)
})

app.post("/post_comment", (req,res) => {
    const {
        comment_author, email, comment, blogId
    } = req.body

    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let commentTitle = comment_author.split(" ").join("-")
    let id = ''
    for(let i = 0; i < 4; i++){
        id += letters[Math.floor(Math.random() * letters.length)]
    }
    // setting up docName
    let comment_id = `${commentTitle}-${id}`

    const date = new Date()
    const new_comment = {
        comment_id: comment_id,
        comment_author: comment_author,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`, 
        email: email, 
        comment: comment,
        likes: Number(0),
        replies: []
    }

    async function addComment() {
        try {
            await client.connect()
                    
            await db.updateOne({ docName: blogId },{ $push: { comments: new_comment }})

            // 301 permanently redirect 
            res.writeHead(301, {
                Location: `/blog/?id=${blogId}`
            }).end()

        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    addComment().catch(console.error)
})

app.post("/post_reply", (req,res) => {
    const {
        reply_author, email, reply, blogId, commentId
    } = req.body

    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let replyTitle = reply_author.split(" ").join("-")
    let id = ''
    for(let i = 0; i < 4; i++){
        id += letters[Math.floor(Math.random() * letters.length)]
    }
    // setting up docName
    let comment_id = `${replyTitle}-${id}`

    const date = new Date()
    const new_reply = {
        comment_id: comment_id,
        reply_author: reply_author,
        reply_publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`, 
        email: email, 
        reply: reply,
        likes: Number(0)
    }

    async function addReply() {
        try {
            await client.connect()
                    
            const result = await db.updateOne(
                {   docName: blogId, 
                    comments: { $elemMatch : { comment_id: commentId}}
                }, { $push : { "comments.$.replies" : new_reply}})
            
            console.log(result)

            // 301 permanently redirect 
            res.writeHead(301, {
                Location: `/blog/?id=${blogId}`
            }).end()

        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    addReply().catch(console.error)
})

app.post('/like_comment', (req, res) => {
    async function like() {
        const {blogId, commentId} = req.body
        try {

            const comment = await getCommentById(blogId, commentId)
            const comments = comment[0].comments
            likes = ``
            comments.forEach((c) => {
                if (c.comment_id === commentId) {
                    likes = c.likes 
                }
            })
            const new_likes = likes + 1
            await updateCommentLikes(blogId, commentId, new_likes)

            res.json(new_likes)

        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    like().catch(console.error)
})

app.post('/dislike_comment', (req, res) => {
    async function dislike() {
        const {blogId, commentId } = req.body
        try {
            const comment = await getCommentById(blogId, commentId)
            const comments = comment[0].comments
            likes = ``
            comments.forEach((c) => {
                if (c.comment_id === commentId) {
                    likes = c.likes 
                }
            })
            const new_likes = likes - 1

            await updateCommentLikes(blogId, commentId, new_likes)

            res.json(new_likes)

        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    dislike().catch(console.error)
})

app.post("/upload_image", (req, res) => {
    let file = req.files.image
    let date = new Date()

    // image name
    let imagename = date.getDate() + date.getTime() + file.name
    // image upload path
    let path = 'src/images/' + imagename

    // create upload
    file.mv(path, (err, result) => {
        if(err){
            throw err
        } else{
            // our image upload path
            res.json(`images/${imagename}`)
        }
    })
})

app.listen("3000", () => {
    console.log('listening.....')
})

async function getBlogById(blogId) {
    try {
        console.log("in get blog by id function")
        await client.connect()
        const result = await db.findOne({ docName: blogId })

        if (result) {
            return result
        } else {
            console.log(`error in get blog by id`)
        }    
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}


async function getCommentById(blogId, commentId) {
    try {
        await client.connect()
        
        const result = await db.aggregate([{$match: { 'comments.comment_id': commentId}} ]).toArray()

        if (result) {
            return result
        } else {
            console.log(`error in get comment by id`)
        }    
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

async function updateCommentLikes(blogId, commentId, likes) {

    try {
        await client.connect()

        await db.updateOne(
            {   docName: blogId, 
                comments: { $elemMatch : { comment_id: commentId}}
            }, { $set : { "comments.$.likes" : likes}})

    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

async function formatArticle(article) {
    str = ``
    
    const data = article.split("\n").filter(item => item.length)
    // console.log(data)

    data.forEach(item => {
        // check for heading
        if(item[0] == '#'){
            let hCount = 0
            let i = 0
            while(item[i] == '#'){
                hCount++
                i++
            }
            let tag = `h${hCount}`
            str += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            seperator = 0

            console.log(item[item.length - 1])
            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 2] == ")"){
                    seperator = i
                    console.log(i)
                }
            }
            console.log(seperator)
            let alt = item.slice(2, seperator)
            let src = item.slice(seperator + 2, item.length - 2)
            console.log(src)
            str += `<img src="../${src}" alt="${alt}" class="article-image">`
        }
        else{
            str += `<p>${item}</p>`
        }
    })
    return str
}

async function formatComments(comments) {
    str = ``
    id = 0
    if (comments.length === 0) { 
        str += `Be the first to leave a comment.`
    }
    
    
    comments.forEach((c) => {
        const {
            comment_id, comment_author, comment, publishedAt, likes, replies
        } = c

        str += `<div class="single_comment${id}" id="single_comment">
            <h3 class="comment_author"> ${comment_author} </h3>
            <h5 id="publishedAt"> ${publishedAt} </h5>
            <div class="comment">${comment} </div>
            <br>
            <div class="comment_likes">
            <h7 name="likes" id="likes_${id}">${likes}</h7> 
            <button onclick="like_comment(${id})" id="likes_btn" class="likes_btn"><img src="../img/thumbsup1.png" alt="like comment"></button>
            <button onclick="dislike_comment(${id})" id="dislikes_btn" class="likes_btn"><img src="../img/thumbsdown1.png" alt="dislike comment"></button>
            <button onclick="reply(${id})" id="reply_btn" class="reply_btn">Reply</button>
            <p name="comment_reply" id="comment_reply_${id}"><p>
            </div>
            <input type="hidden" id="commentId_${id}" value="${comment_id}"/>
            
            <br>
            <hr>
            
            <div class="comment_replies">`

        // iterate over comment replies
        replies.forEach((r) => {
            const {
                reply_author, reply, reply_publishedAt, reply_likes, 
            } = r

            str += `<div class="single_reply" id="single_reply">
            <h3 class="comment_author"> ${reply_author} </h3>
            <h5 id="publishedAt"> ${reply_publishedAt} </h5>
            <div class="reply"> ${reply} </div>
            <br>
            <hr>
            </div> `
            
        })
        str += `</div></div>`

        id += 1
    })
    return str
}
 
