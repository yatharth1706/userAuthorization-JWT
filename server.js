require('dotenv').config()

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(express.json())

const users = []

const posts = [
    {
        name : 'Kyle',
        title : 'Post 1'
    },
    {
        name : 'Yash',
        title : 'Post 2'
    }
]

app.get('/users', (req,res) => {
    res.json(users);
})

app.post('/users', async (req,res) => {
   
   
   try{
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword)
    const user = {
        name : req.body.name,
        password : hashedPassword
    }

    users.push(user)
    res.status(201).send();

} catch{
    res.status(500).send();
}
   
    
})

app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter((post) => post.name === req.user.name ));
})


app.post('/login' , async (req,res) => {
    // Authenticate User
    const user = users.find(user => user.name = req.body.name)
    if(user == null){
        return res.status(400).send('Cannot find user Sorry!!');
    }

    // now compare the password which is sent in request with your database
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            const username  = req.body.name
            const user = {
                name : username
            }
            
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            console.log(accessToken);
            // res.send("Success")
            
            res.json({
                accessToken : accessToken
            })
        }else{
            res.send("Not Allowed");
        }
    }catch{
        res.status(500).send("Password not matching!!")
    }



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
