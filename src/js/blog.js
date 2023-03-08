const likesBtn = document.querySelector('likes_btn')
const blogId = document.getElementById('blogId').value
const commentId = document.querySelector('commentId')
const publishedAt = document.getElementById('publishedAt')
const article = document.getElementById(`article`).value


function reply(id) {
    
    const reply_field = document.getElementById(`comment_reply_${id}`)
    const commentId = document.getElementById(`commentId_${id}`).value
    console.log(commentId)

    s = `<div class=replyform>
    <form  action="/post_reply" method="post" id="replyform">
      
    <label for="reply_author" class="required">Name</label>
    <input type="text" name="reply_author" id="reply_author" value="" tabindex="1" required="required">

    <label for="email" class="required">Email</label>
    <input type="email" name="email" id="email" value="" tabindex="2" required="required">

    <label for="reply" class="required">Message</label>
    <textarea name="reply" id="reply" rows="10" tabindex="4"  required="required"></textarea>

    <input type="hidden" name="blogId" value="${blogId}" id="blogId" />
    <input type="hidden" name="commentId" value="${commentId}" id="commentId" />
    <input name="submit" type="submit" class="btn" value="Submit reply" />

    </form>
    </div>`
    reply_field.innerHTML = s

}

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
