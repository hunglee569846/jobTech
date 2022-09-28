const express = require('express');
const router = express.Router();


/*Get home*/
router.get('/',function(req, res){
    res.json({admin: "admin page"})
});

router.get('/getAll', function(req, res){
    res.json({post: "get all user"})
});

module.exports = router;