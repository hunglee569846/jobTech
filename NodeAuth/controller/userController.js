const express = require('express')
const user = require('../model/user')
const bcryptPassword = require('../lib/encryptPassword')
const accessToken = require('../middleware/accessToken')
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const bcrypt = require('bcrypt');


module.exports = {
    selectUserAccount,
    registerUser,
    refreshToken,
    login,
    logout
}

function selectUserAccount(req, res) {
    return new Promise(() => {
        console.log("request: ", req);
        user.selectUserInfo()
            .then((result) => {
                if (result) {
                    console.log("=======result:", result.rows);
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
    return new Promise((resolve, reject) => {
        let userParam = {
            username: req.query.username,
            password: req.query.password,
        };
        let token = {
            access_token: '',
            refresh_access_token: '',
            //useruuid: ''
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
                    token.useruuid = result.rows[0].user_id;
                    return bcryptPassword.verifyPassord(result.rows[0].hash_password, req.query.password);
                }
            })
            .then(result => {
                if (result === true) {
                    return accessToken.accessToken(payload);
                } else
                    throw new Error("incorrect password!");
            })
            .then((result) => {
                if (result === true || result.access_token !== undefined && result.refresh_access_token !== undefined) {
                    token.access_token = result.access_token;
                    token.refresh_access_token = result.refresh_access_token;
                    return user.registToken(token);
                } else if (result === false) {
                    return false;
                }
            })
            .then(result => {
                if (result.rowCount > 0) {
                    res.status(200).json(token).end();
                } else if (result === false) res.status(403).json('incorrect password').end();
            })
            .catch(err => {
                res.status(403).json(err).end();
            })

    })

}

function refreshToken(req, res) {
    return new Promise((resolve, reject) => {
        let result = accessToken.decodedRefeshToken(req);
        let tokenNew = {
            access_token: '',
            refresh_access_token: '',
        };

        let token = {
            access_token: '',
            refresh_access_token: '',
            useruuid: result.userid
        }

        if (!result) {
            res.status(401).json({ Error: "refesh token corected." }).end();
        }
        else {
            let param = {
                username: result.username,
                userid: result.userid
            }
            user.selectUserbyUsername(param)
                .then(result => {
                    if (!!result.rows && result.rows[0].refresh_access_token === req.rawHeaders[1]) {
                        return accessToken.accessToken(param);
                    } else
                        throw new Error("incorrect password!");
                })
                .then((result) => {
                    if (result === true || result.access_token !== undefined && result.refresh_access_token !== undefined) {
                        token.access_token = result.access_token;
                        token.refresh_access_token = result.refresh_access_token;
                        tokenNew.access_token = result.access_token;
                        tokenNew.refresh_access_token = result.refresh_access_token;
                        return user.registToken(token);
                    } else if (result === false) {
                        return false;
                    }
                })
                .then(result => {
                    console.log("=====result: ", result);
                    if (result.rowCount > 0) {
                        res.status(200).json(tokenNew).end();
                    } else if (result === false) res.status(403).json('incorrect password').end();
                })
                .catch(err => {
                    res.status(404).json(err.message).end();
                })
        }


    })
}



function logout(req, res) {
    return new Promise((resolve, reject) => {
        let userParam = {
            username: req.query.username,
            password: req.query.password,
        };
        let payload = {
            username: '',
            userid: '',
        }
        user.selectUserbyUsername(userParam)
            .then(result => {
                if (result.rowCount == 0) {
                    throw new Error("User password incorrect!");
                }else {
                    payload.username = result.rows[0].user_name;
                    payload.userid = result.rows[0].user_id;
                    return bcryptPassword.verifyPassord(result.rows[0].hash_password, req.query.password);
                }
            })
            .then(result =>{
                if (result !== true) {
                    throw new Error("User password incorrect!");
                }else
                    return true;
            })
            .then(result => {
                if (result === true) {
                    return user.logout(payload.userid);
                } else
                    throw new Error("incorrect password!");
            })
            .then(result => {
                if (result.rowCount > 0) {
                    res.status(200).json({ status: "lougout sucess." }).end();
                } else
                    throw new Error("logout false!");
            }).catch(err => {
                return res.status(404).json(err.message).end();
            })
    })
}

// function logout(){
//     return new Promise((resolve, reject)=>{

//     })
// }
