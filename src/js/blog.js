const likesBtn = document.querySelector('likes_btn');
const blogId = document.getElementById('blogId')
const commentId = document.querySelector('commentId')

function upvote() {
    console.log("clicked upvote")
    console.log("blogID " + blogId.value)
    console.log("commentId " + commentId.value)
    fetch('/upvote_comment', {
        method: 'post',
        body: { blogId: blogId.value, commentId: commentId.value }
    }).then(res => res.json())
    .then(data => {
        console.log(data)
    })
}