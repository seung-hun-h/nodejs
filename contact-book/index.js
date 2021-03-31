var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var app = express();

require('dotenv').config()

// DB Setting 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection
db.once('open', () => {
    console.log("DB connected!");
});
db.on('error', (err) => {
    console.log("DB ERROR: ", err)
})
// Other setting
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


// Routes
app.use('/', require('./routes/home'));
app.use('/contacts', require('./routes/contacts'));

var port = 8000;
app.listen(port, () => {
    console.log('Server on! http://localhost:'+port);
});