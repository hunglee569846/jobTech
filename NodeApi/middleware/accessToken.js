const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user = require('../model/user');
const { reject } = require('bcrypt/promises');

dotenv.config();
//const expiresIn = {expiresIn: '30s'}

module.exports = {
    accessToken,
    loginCheck,
    decodedToken,
    checkPermission
}

function accessToken(param) {
    return new Promise((resolve, reject) => {
        try {
            let payload = {
                username: param.username,
                userid: param.userid,
            }
            console.log("====payload: ", payload);
            let responseToken = {
                access_token: jwt.sign(payload, process.env.ACCES_TOKEN_SECRET, { expiresIn: '30s' }, payload.userid),
                refresh_access_token: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, '', payload.userid)
            }

            resolve(responseToken);
        } catch (error) {
            console.log("accessToken: ", error);
            reject(error);
        }
    })

}

function decodedToken(req) {
    let reqHeader = req.rawHeaders[1];
    const header_request_cut = reqHeader.split(" ");
        return jwt.verify(header_request_cut[1], process.env.ACCES_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                console.log("===== error: ", err);
                return 'jwt expired';
            }
                
            else return decoded;
        })
}

function loginCheck(req, res, next) {
    let decode_token = decodedToken(req);
    if (decode_token === 'jwt expired') {
        return res.status(401).json('token expires').end();
    } else next();

}

function checkPermission(req,res){
    return new Promise ((resolve, reject)=>{
    let decode_token = decodedToken(req);
    if (!!decode_token && decode_token !== 'jwt expired') {
        user.selectUserInfo(decode_token.userid)
        .then(result =>{
            resolve(result.rows[0].role);
        })
    }else
        return res.status(401).json("token expired").end();
    })
    
}

