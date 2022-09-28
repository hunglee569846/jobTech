const {query} = require('../model/pg');
const bcryptPassword = require('../lib/encryptPassword')

module.exports = {
    selectUserInfo: function(userUUID){
        let sql = `select ui.uuid ,ui."name" ,ui .user_id ,ui.phone_number ,ui.company ,ui.email ,ui."role" ,ui.created_date  
        from authentication.user_info ui where ui.user_id = $1 and isdelete = false and isactive = true;`;
        return query(sql, [userUUID])
    },

    selectUserbyUsername: function(param){
        let sql = `select * from authentication."user" u where u.user_name = '${param.username}'`;
        return query(sql, [])
    },

    registerUser: function(param){
            let sql = `insert into authentication."user" 
            (user_id, user_name,salrpassword,hash_password, refresh_access_token, access_token)
            values($1,$2,$3,$4,$5,$6) on conflict do nothing`;
        return query(sql, [param.useruuid, param.username, param.salrpassword, param.hashpassword,param.refresh_access_token,param.access_token])
        
    },

    registToken: function(param){
        console.log("registToken: ",param);
        let sql = `update authentication."user" set access_token = $1, refresh_access_token =$2
        where user_id = $3`;
        return query(sql, [param.access_token,param.refresh_access_token,param.useruuid]);
    }
    
}

