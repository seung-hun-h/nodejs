var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var flash = require('connect-flash'); //route간 정보전달. 사용될때까지 서버 메모리에 저장되고 사용된 후 사라진다.
var session = require('express-session'); // 접속자 구분. user1과 user2의 값이 서로다름
var app = express();
require('dotenv').config();


// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);

var db = mongoose.connection
db.once('open', () =>{
    console.log("DB connected!");
});
db.on('error', (err) => {
    console.log("DB ERROR: " + err);
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash())
app.use(session({secret: process.env.SESSION_SECRET, resave:true, saveUninitialized:true }));

app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

var port = 8000;
app.listen(port, () => {
    console.log('Server on http://localhost:'+port);
});