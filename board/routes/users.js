var express = require('express');
var router = express.Router();
var User = require('../models/User');

// Index
router.get('/', (req, res) => {
    User.find({})
        .sort({username:1})
        .exec((err, users) => {
            if(err) return res.json(err)
            res.render('users/index', {users:users});
        });
});

// New
router.get('/new', (req, res) => {
    // user, errors from create
    // 생성시 오류가 발생한 경우 입력한 데이터 보여주기 위함
    var user = req.flash('user')[0] || {};
    var errors = req.flash('errors')[0] || {}; 
    res.render('users/new', { user:user, errors:errors });
})

// create
router.post('/', (req, res) => {
    User.create(req.body, (err, user) => {
        // 에러가 발생한 경우 
        // 입력한 사용자 정보와
        // 에러 정보를 new에 전달한다.
        if(err){ 
            req.flash('user', req.body);
            req.flash('errors', parseError(err));
            return res.redirect('/users/new');
        }
        res.redirect('/users');
    });
});

// Show
router.get('/:username', (req, res) => {
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err)
        res.render('users/show', {user:user});
    });
});

// Edit
router.get('/:username/edit', function(req, res) {
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0] || {};

    if(!user){
        User.findOne({username:req.params.username}, function(err, user){
            if(err) return res.json(err);
            res.render('users/edit', { username: req.params.username, user: user, errors: errors });
        });
    } else {
        res.render('users/edit', { username: req.body.username, user: user, errors: errors });
    }
});

// Update
router.put('/:username', function(req, res){
    User.findOne({username:req.params.username})
        .select('password')
        .exec(function(err, user){
            if (err) return res.json(err)

            user.originalPassword = user.password;
            user.password = req.body.newPassword? req.body.newPassword:user.password;

            for(var p in req.body){
                user[p] = req.body[p];
            }

            user.save(function(err, user){
                if(err) return res.json(err)
                res.redirect('/users/'+user.username);
            });
        });
    });
// Destroy
router.delete('/:username', function(req, res){
    User.deleteOne({username:req.params.username}, function(err){
        if(err) return res.json(err)
        res.redirect('/users');
    });
});

module.exports = router;
    
// functions
// validation 을 통과하지 못한 경우와
// mongodb 자체 에러의 형식이 상이하기 때문에 
// 형식을 통일 해준다.
function parseError(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = {message: validationError.message};
        }
    } else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0){
        parsed.username = { message: 'This username is already exists!' };
    } else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}
