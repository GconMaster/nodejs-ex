var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');

module.exports = function (app, passport) {
    
    
    // 사용자 인증 성공 시 호출
    passport.serializeUser(function(user, done) {
        
        done(null, user);
    });
    
    // 사용자 인증 이후 사용자 요청 시 호출
    
    passport.deserializeUser(function(user, done) {
       
        done(null, user);
    });
    
    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
    console.log('local-strategy 사용');
}