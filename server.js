require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        name : 'Kyle',
        title : 'Post 1'
    },
    {
        name : 'jim',
        title : 'Post 2'
    }
];


app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter((post) => post.name === req.user.name ));
})



function authenticateToken(req,res,next){
    // get the headers and replace the token 
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if(token == null){
        return res.sendStatus(401);
    }


    // if everything went successfull verify the token and show the posts

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user) => {
        if(err){
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    })
}


app.listen(3000, () => {
    console.log("Server has started at port 3000!!!");
})
