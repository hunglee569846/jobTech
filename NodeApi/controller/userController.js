const express = require('express')
const user = require('../model/user')
const bcryptPassword = require('../lib/encryptPassword')
const accessToken = require('../middleware/accessToken')
const { v4: uuidv4 } = require('uuid')
const uuid = uuidv4()
const bcrypt = require('bcrypt')



module.exports = {
    selectUserAccount,
    registerUser,
    login, 
    selectUserInfo,
    testdecodetoken,
    refreshToken
}

function selectUserAccount(req, res) {
    return new Promise(() => {
        console.log("request: ", req);
        user.selectUserInfo()
            .then((result) => {
                if (result) {
                    res.status(200).json(result.rows).end();
                }
            }).catch(err => console.log("select info Error: ", err))
    })
}

function registerUser(req, res) {
    return new Promise((resolve, reject) => {
        let userParam = {
            username: req.query.username,
            password: req.query.password,
        }
        console.log("Log info user registerUser: ", userParam);
        user.selectUserbyUsername(userParam)
            .then(result => {
                if (result.rowCount > 0) {
                    res.status(451).json({
                        statusCode: 451,
                        comment: "User registration failed."
                    })
                } else {
                    const password = req.query.password;
                    bcryptPassword.encryptPassword(password)
                        .then(result => {
                            if (result) {
                                let param = {
                                    hashpassword: result.hashpassword,
                                    salrpassword: result.salrpassword,
                                    useruuid: uuid,
                                    username: req.query.username,
                                    access_token: 'new',
                                    refresh_access_token: 'new'
                                };
                                user.registerUser(param)
                                    .then(result => {
                                        if (result.rowCount > 0) {
                                            res.status(200).json({
                                                statusCode: 200,
                                                comment: "Register User Sucess."
                                            })
                                        }
                                    })
                            }
                        })
                }
            })
            .catch(err => {
                console.log("error register: ", err);
                reject(err);
            })
    })
};

function login(req, res) {
    return new Promise((resolve,reject) => {
        let userParam = {
            username: req.query.username,
            password: req.query.password,
        };
        let token ={
            access_token: '',
            refresh_access_token: '',
            useruuid: ''
        }
        let payload = {
            username: '',
            userid: '',
        }
        user.selectUserbyUsername(userParam)
            .then(result => {
                if (result.rows) {
                    payload.username = result.rows[0].user_name;
                    payload.userid = result.rows[0].user_id;
                    
                    token.useruuid= result.rows[0].user_id;
                    return bcryptPassword.verifyPassord(result.rows[0].hash_password, req.query.password);
                }
            })
            .then(result =>{
                    if (result === true) {
                        return accessToken.accessToken(payload);
                    }else { // res.status(405).json({error: 'incorrect password'}).end();
                        throw(new Error("incorrect password!"));
                        // return;
                    } 
            })
            .then((result) => {
                if (result === true || result.access_token !== undefined && result.refresh_access_token !== undefined) {
                    token.access_token = result.access_token;
                    token.refresh_access_token = result.refresh_access_token;
                    return user.registToken(token);
                }else if (result === false) {
                    return false; 
                }
            })
            .then(result=>{
                if(result.rowCount > 0 ){
                    res.status(200).json(token).end();
                }else if (result === false) res.status(403).json('incorrect password').end();
            })
            .catch(err => {
                res.status(500).json(err);
            })

    })

}

function selectUserInfo(req,res){
    let checkToken = accessToken.decodedToken(req,res);

    if (checkToken === 'jwt expired') {
        return res.status(401).end('token expires');
    }else {
        
        if (checkToken.userid) {
            user.selectUserInfo(checkToken.userid)
            .then(result =>{
                let userInnfo = {
                    uuid:result.rows[0].uuid,
                    userId: result.rows[0].user_id,
                    name: result.rows[0].name,
                    phoneNumber: result.rows[0].phone_number,
                    company: result.rows[0].company,
                    email: result.rows[0].email,
                    role: result.rows[0].role,
                    createdDate: result.rows[0].created_date,
                };
                res.status(200).json(userInnfo).end();
            }).catch(err =>{
                console.log("selectUserInfo Error: ",err);
            })
        }
    }
    
}

function refreshToken( req, res ){

} 

function testdecodetoken(req,res){
    res.status(200).json('pass checklogin').end();
}
