
// 404 에러 화면
var err_404 = function(req, res) {
    console.log('err_404  -> route 호출')
     // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('404.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('404.ejs', {login_success:true});
        } else {
            res.render('404.ejs', {login_success:true});
        }
    }

};

// home 화면
var home = function(req, res) {
    console.log('home  -> route 호출');
    // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('index.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('index.ejs', {login_success:true, user: req.user[0]._doc});
        } else {
            res.render('index.ejs', {login_success:true, user: req.user});
        }
    }
};

// About - 소개
var about = function(req, res) {
    console.log('about  -> route 호출');
    
    // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('about.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('about.ejs', {login_success:true, user: req.user[0]._doc});
        } else {
            res.render('about.ejs', {login_success:true, user: req.user});
        }
    }

};

// About - 회칙
var rule = function(req, res) {
    console.log('rule  -> route 호출');
    
     // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('rule.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('rule.ejs', {login_success:true, user: req.user[0]._doc});
        } else {
            res.render('rule.ejs', {login_success:true, user: req.user});
        }
    }
};
    
// About - 연혁
var history = function(req, res) {
    console.log('history -> route 호출');
    
     // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('history.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('history.ejs', {login_success:true, user: req.user[0]._doc});
        } else {
            res.render('history.ejs', {login_success:true, user: req.user});
        }
    }   
};


// Member - 회원 명단

var members = function(req, res) {
    console.log('members -> route 호출');
    
     var database = req.app.get('database');
    if (database.db) {
        database.UserModel.findAll(function(err, results) {
            if (err) {
                console.log('database -> find Error');
                res.redirect('/404');
                return;
            }
            
            if (results) {
                var context = {
                    results: results
                };
                // 인증 안된 경우
                if (!req.user) {
                    console.log('사용자 인증 안된 상태임.');
                    context.login_success = false;
                } else {
                    console.log('사용자 인증된 상태임.');
                    if (Array.isArray(req.user)) {
                        context.login_success = true;
                        context.user = req.user[0]._doc;
                    } else {
                        context.login_success = true;
                        context.user = req.user;
                    }
                }   
                res.render ('members.ejs', context);
            } else {
                console.log('database_user -> no results');
                res.redirect('/404');
                return;            
            }
        });
    } else {
        console.log('database_user -> no database');
        res.redirect('/404');
        return;
    }
};

// addpost
var addpost = function(req, res) {
    console.log('addpost -> route 호출');

     // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.render('addpost.ejs', {login_success:false});
    } else {
        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('addpost.ejs', {login_success:true, user: req.user[0]._doc});
        } else {
            res.render('addpost.ejs', {login_success:true, user: req.user});
        }
    }   
};

// router 목록
var route_func = {
    err_404:err_404,
    home: home,
    about: about,
    rule: rule,
    history: history,
    members: members,
    addpost:addpost
}

module.exports = route_func;