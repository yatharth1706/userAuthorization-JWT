const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

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

app.get('/posts', (req,res) => {
    res.json(posts);
})


app.post('/users/login' , async (req,res) => {
    // Authenticate User
    const user = users.find(user => user.name = req.body.name)
    if(user == null){
        return res.status(400).send('Cannot find user Sorry!!');
    }

    // now compare the password which is sent in request with your database
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Success");
        }else{
            res.send("Not Allowed");
        }
    }catch{
        res.status(500).send("Password not matching!!")
    }


})



app.listen(3000, () => {
    console.log("Server has started at port 3000!!!");
})
