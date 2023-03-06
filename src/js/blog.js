const likesBtn = document.querySelector('likes_btn')
const blogId = document.getElementById('blogId').value
const commentId = document.querySelector('commentId')
const publishedAt = document.getElementById('publishedAt')


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