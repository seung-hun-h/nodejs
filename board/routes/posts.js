var express = require('express');
var router = express.Router();
var Post = require('../models/Post');

router.get('/', (req, res) => {  
  Post.find({})
    .sort('-createdAt')
    .exec(function(err, posts){
      if(err) return res.json(err);
      res.render('posts/index', {posts:posts});
    });
});

router.get('/new', (req, res) => {
    res.render('posts/new');
});

router.post('/', (req, res) => {
    Post.create(req.body, (err, post) => {
        if (err) return res.json(err)
        res.redirect('/posts');
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if (err) return res.json(err)
        res.render('posts/show', {post:post});
    })
})

router.get('/:id/edit', (req, res) => {
    Post.findOne({_id: req.params.id}, (err, post) => {
        if (err) return res.json(err)
        res.render('posts/edit', {post:post});
    });
});

router.put('/:id', (req, res) => {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id:req.params.id}, req.body, (err, post) => {
        if(err) return res.json(err);
        res.redirect("/posts/"+req.params.id);
    })
});

// destroy
router.delete('/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});


module.exports = router