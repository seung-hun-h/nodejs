var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash('errors', {login: 'Please login first'});
    res.redirect('/login');
  }
}

util.noPermission = function(req, res) {
  req.flash('errors', {login: "You don't have permission"});
  req.logout();
  res.redirect('login');
}

util.getPostQueryString = function(req, res, next) {
  // res.locals는 매 request마다 초기화 된다.
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page ? overwrites.page : (req.query.page ? req.query.page : '');
    var limit = overwrites.limit ? overwrites.limit : (req.query.limit ? req.query.limit : '');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);

    if(queryArray.length>0) queryString = (isAppended ? "&":"?") + queryArray.join("&");

    return queryString;
  }
  next(); // 미들웨어 작성 시 next 필수!
}

module.exports = util;
