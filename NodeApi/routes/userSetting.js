const express = require('express');
const { user } = require('pg/lib/defaults');
const userController = require('../controller/userController');
const middeware = require('../middleware/accessToken');
const router = express.Router();
const AccessTokenMiddle = require('../middleware/accessToken');

router.get('/',permission,function(req,res){
    userController.selectUserAccount(req,res);
});

router.post('/resgisteruser',function(req,res){
    userController.registerUser(req,res);
})

router.post('/resgisteruser/login',function(req,res){
    userController.login(req,res);
});

router.post('/testdecodetoken',loginCheck ,function(req,res){
    userController.testdecodetoken(req,res);
});

// router.post('/r',loginCheck ,function(req,res){
//     userController.testdecodetoken(req,res);
// });

router.get('/userinfo',loginCheck, function(req,res){0
    console.log('+=====req.user: ',req);
    userController.selectUserInfo(req,res);
});

module.exports = router;

async function permission(req,res,next){
    AccessTokenMiddle.checkPermission(req,res)
    .then(result =>{
        if(result === 'TW' || result === 'admin') 
            next();
        else 
            res.status(403).json('Do not permission.').end();
    })
    
}

function loginCheck(req, res, next) {
    console.log('+=====req.user: ',req);
    let decodeA = AccessTokenMiddle.decodedToken(req, res);
        if (decodeA === 'jwt expired') {
            return res.status(503).end('token expires');
        }else next();
}