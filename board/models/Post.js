var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: {type: String, require: true},
    body: {type: String, require: true},
    createdAt: {type: Date, default:Date.now},
    updatedAt: {type: Date}    
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;