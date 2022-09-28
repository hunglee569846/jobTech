const express = require('express');
const admiroutes = require('./routes/admin');
const usersetting = require('./routes/userSetting');

const app = express();

const bodyPaser = require('body-parser');

//khoi dong middleware

app.use(express.json())
app.use(bodyPaser.urlencoded({extended: true}))
app.use(bodyPaser.json())

app.get('/post', (req,res)=> {
    res.json({post: "my post"})
});

app.use('/admin',admiroutes)
app.use('/usersetting',usersetting)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server satated on port ${PORT}`));