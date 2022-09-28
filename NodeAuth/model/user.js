const {query} = require('../model/pg');
const bcryptPassword = require('../lib/encryptPassword')

module.exports = {
    selectAccoutInfo: function(){
        let sql = 'select * from authentication."user_account" u';
        return query(sql, [])
    },

    selectUserbyUsername: function(param){
        let sql = `select * from authentication."user_account" u where u.user_name = '${param.username}'`;
        return query(sql, [])
    },

    registerUser: function(param){
            let sql = `insert into authentication."user_account" 
            (user_id, user_name,salrpassword,hash_password, refresh_access_token, access_token)
            values($1,$2,$3,$4,$5,$6) on conflict do nothing`;
        return query(sql, [param.useruuid, param.username, param.salrpassword, param.hashpassword,param.refresh_access_token,param.access_token])
        
    },

    registToken: function(param){
        console.log("registToken: ",param);
        let sql = `update authentication."user_account" set access_token = $1, refresh_access_token =$2
        where user_id = $3`;
        return query(sql, [param.access_token,param.refresh_access_token,param.useruuid]);
    }
    
}

