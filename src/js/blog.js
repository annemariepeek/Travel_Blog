const likesBtn = document.querySelector('likes_btn')
const blogId = document.getElementById('blogId').value
const commentId = document.querySelector('commentId')
const publishedAt = document.getElementById('publishedAt')
const article = document.getElementById(`article`).value

document.addEventListener('DOMContentLoaded', function() {
    // formatArticle()
}, false)

function like_comment(id) {

    const commentId = document.getElementById(`commentId_${id}`).value
    const likes = document.getElementById(`likes_${id}`)
    
    const data = { blogId: blogId, commentId: commentId }
    fetch('/like_comment', {
        method: 'post',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        likes.innerHTML = data 
    })
}

function dislike_comment(id) {

    const commentId = document.getElementById(`commentId_${id}`).value
    const likes = document.getElementById(`likes_${id}`)
    
    const data = { blogId: blogId, commentId: commentId }
    fetch('/dislike_comment', {
        method: 'post',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        likes.innerHTML = data 
    })
}

function formatArticle() {
    console.log(article)
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
            article.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            let seperator

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    seperator = i
                }
            }

            let alt = item.slice(2, seperator)
            let src = item.slice(seperator + 2, item.length - 1)
            article.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `
        }

        else{
            article.innerHTML += `<p>${item}</p>`
        }
    })
}
