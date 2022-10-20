const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
//const expiresIn = {expiresIn: '30s'}

module.exports = {
    accessToken,
    decodedToken,
    decodedRefeshToken
}

function accessToken(param) {
    return new Promise((resolve, reject) => {
        try {
            let payload = {
                username: param.username,
                userid: param.userid,
            }
            let responseToken = {
                access_token: jwt.sign(payload, process.env.ACCES_TOKEN_SECRET, { expiresIn: '30m' }, payload.userid),
                refresh_access_token: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, '', payload.userid)
            }

            resolve(responseToken);
        } catch (error) {
            console.log("accessToken: ", error);
            reject(error);
        }
    })

}

function decodedToken(req, res) {
    return jwt.verify(req.rawHeaders[1], process.env.ACCES_TOKEN_SECRET, function (err, decoded) {
        if (err)
            return 'jwt expired';
        else return decoded;

    })
}

function decodedRefeshToken(req, res) {
    let reqHeaderToken = req.rawHeaders[1];
    const header_request_cut_token = reqHeaderToken.split(" ");
    return jwt.verify(header_request_cut_token[1], process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
        if (err)
            return 'jwt expired';
        else return decoded;

    })
}