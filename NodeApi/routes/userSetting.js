const express = require('express');
const { user } = require('pg/lib/defaults');
const userController = require('../controller/userController')
const middeware = require('../middleware/accessToken')
const router = express.Router();
const decodedaccestoken = require('../middleware/accessToken')

router.get('/',function(req,res){
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

router.get('/userinfo',loginCheck, function(req,res){
    userController.selectUserInfo(req,res);
});

module.exports = router;

function loginCheck(req, res, next) {
    let decodeA = decodedaccestoken.decodedToken(req, res);
        if (decodeA === 'jwt expired') {
            return res.status(503).end('token expires');
        }else next();
}