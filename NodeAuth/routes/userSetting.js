const express = require('express');
const userController = require('../controller/userController')
const decodedaccestoken = require('../middleware/accessToken')
const router = express.Router();

router.get('/',function(req,res){
    userController.selectUserAccount(req,res);
});

router.post('/resgisteruser',function(req,res){
    userController.registerUser(req,res);
})

router.post('/resgisteruser/login',function(req,res){
    userController.login(req,res);
});

router.post('/refresh', function(req,res){
    userController.refreshToken(req,res);
});

router.post('/logout',function(req,res){
    userController.logout(req,res);
});


module.exports = router;

function loginCheck(req, res, next) {
    let decodeA = decodedaccestoken.decodedToken(req, res);
        if (decodeA === 'jwt expired') {
            return res.status(503).end('token expires');
        }else next();
}