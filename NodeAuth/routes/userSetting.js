const express = require('express');
const userController = require('../controller/userController')
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


// router.get('/login',function(req,res){
//     userController.registerUser(req,res);
// });



module.exports = router;
