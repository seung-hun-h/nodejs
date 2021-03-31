var mongoose = require('mongoose');
require('dotenv').config();

var contactSchema = mongoose.Schema({
    name: {type: String, require: true, unique: true},
    phone: {type: String},
    email: {type: String}
})
var Contact = mongoose.model('contact', contactSchema);

module.exports = Contact