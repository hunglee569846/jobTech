const bcrypt = require('bcrypt');

const saltRounds = 10;


module.exports = {
    encryptPassword,
    verifyPassord
}

function encryptPassword(password){
    return new Promise((resolve, reject)=>{
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                resolve({hashpassword: hash,
                         salrpassword: salt})
            });
        });
    })
    
}
function verifyPassord(hashPassword, password){
    return new Promise((resolve)=>{
        bcrypt.compare(password, hashPassword, function(err, result) {
            console.log("veryfile: result: ",result,"pass: ", password);
            if (err) {
                console.log("verify error: ",err);
            }else{
                console.log("veryfile: result: ",result);
                resolve(result);
            }
        });
    })
}