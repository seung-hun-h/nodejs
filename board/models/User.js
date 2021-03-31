var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username: {
      type: String, 
      required: [true, 'Username is required!'], 
      match: [/^.{4,12}$/, 'Should be 4-12 characters'],
      trim: true,
      unique: true
    },
    password: {
      type:String, 
      required: [true, 'Password is required!'], 
      select: false
    },
    name: {
      type:String,
      match: [/^.{4,12}$/, 'Should be 4-12 characters'], 
      required: [true, 'Name is required!']
    },
    email: {
      type: String,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Should be a valid email address!']
    }
}, {
    toObject:{virtuals: true}
});

userSchema.virtual('passwordConfirmation')
    .get(() => { return this._passwordConfirmation; })
    .set(value => { this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
    .get(() => { return this._originalPassword; })
    .set(value => { this._originalPassword=value; });

userSchema.virtual('currentPassword')
    .get(() => { return this._currentPassword; })
    .set(value => { this._currentPassword=value; });

userSchema.virtual('newPassword')
    .get(() => { return this._newPassword; })
    .set(value => { this._newPassword=value; });

// Arrow Function이 안됨
// 왜 Schema에 정규표현식을 사용하지 않았나?
// 비밀번호가 DB와 웹 상 이동하지 않으므로!
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function(v) {
    var user = this;

    // create user
    if(user.isNew){
      if(!user.passwordConfirmation){
        user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
      }
      
      if(!passwordRegex.test(user.password)){
        user.invalidate('password', passwordRegexErrorMessage);
      }

      if(user.password !== user.passwordConfirmation) {
        user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
      }
    }
  
    // update user
    if(!user.isNew){
      if(!user.currentPassword){
        user.invalidate('currentPassword', 'Current Password is required!');
      }
      else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
        user.invalidate('currentPassword', 'Current Password is invalid!');
      }
      if(!passwordRegex.test(user.newPassword)){
        user.invalidate('newPassword', passwordRegexErrorMessage);
      }
      if(user.newPassword !== user.passwordConfirmation) {
        user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
      }
    }
});

// Hashing password
userSchema.pre('save', function(next){
  var user = this

  if(!user.isModified('password')){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next()    
  }
});

// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};


var User = mongoose.model('user', userSchema);
module.exports = User;