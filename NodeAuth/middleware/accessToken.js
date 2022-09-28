const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
//const expiresIn = {expiresIn: '30s'}

module.exports = {
    accessToken
}

function accessToken(param){
    return new Promise((resolve, reject)=>{
        try {
            let payload= {
                username: param.username,
                userid: param.userid,
            }
            let responseToken = {
                access_token: jwt.sign(payload,process.env.ACCES_TOKEN_SECRET,{expiresIn: '30s'},payload.userid),
                refresh_access_token: jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,'',payload.userid)
            }

            resolve(responseToken);
        } catch (error) {
            console.log("accessToken: ", error);
            reject(error);
        }
    })
   
}
