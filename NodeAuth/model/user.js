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
        let sql = `update authentication."user_account" set access_token = $1, refresh_access_token =$2, fail_count = 0
        where user_id = $3`;
        return query(sql, [param.access_token,param.refresh_access_token,param.useruuid]);
    },

    logout: function(useruuid){
        let sql = `update authentication."user_account" set access_token = '', refresh_access_token =''
        where user_id = $1`;
        return query(sql, [useruuid]);
    },

    updateFailCountAccount: function(param){
        let sql = `update authentication.user_account set fail_count = (select fail_count from authentication.user_account where user_name = $1) + 1 where user_name = $1`;
        return query(sql, [param.username]);
    }
    
}

