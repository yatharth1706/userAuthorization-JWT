require('dotenv').config()

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(express.json())

const users = []
let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

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
            
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken)
            console.log(accessToken);
            // res.send("Success")
            
            res.json({
                accessToken : accessToken,
                refreshToken : refreshToken
            })
        }else{
            res.send("Not Allowed");
        }
    }catch{
        res.status(500).send()
    }



})




function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '35s' })
}


app.listen(4000, () => {
    console.log("Server has started at port 4000!!!");
})
