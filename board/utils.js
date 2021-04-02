var utils = {};

// functions
// validation 을 통과하지 못한 경우와
// mongodb 자체 에러의 형식이 상이하기 때문에 
// 형식을 통일 해준다.
utils.parseError = function(errors){
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

module.exports = utils;