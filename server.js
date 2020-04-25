const express = require('express');
const app = express();

const posts = [
    {
        username : 'Kyle',
        title : 'Post 1'
    },
    {
        username : 'Yash',
        title : 'Post 2'
    }
]

app.get('/posts', (req,res) => {
    res.json(posts);
})

app.listen(3000, () => {
    console.log("Server has started at port 3000!!!");
})
