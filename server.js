var express = require('express');
var http = require('http');

// ===== 클라이언트 접근 제한 ===== //
var static = require('serve-static');
var path = require('path');

// ===== 페이지 에러 핸들러 ===== //
var expressErrorHandler = require('express-error-handler');

var app_set = require('./config/app_setting');
var route_loader = require('./routes/route_loader');
var database_loader = require('./database/database_loader');


// ===== POST ===== //
var bodyParser = require('body-parser');
// ===== Cookie ===== //
var cookieParser = require('cookie-parser');


// ===== Session ===== //
var expressSession = require('express-session');


// ===== Passport 사용 ===== //
var passport = require('passport');
var flash = require('connect-flash');


var config = require('./config/config');

console.log('익스프레스로 웹서버 구동 준비');

var app = express();





app.set('views',  __dirname + '/views');
app.set('view engine', 'ejs');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || config.server_port || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_PORT || '127.0.0.1');

app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
        secret:'my key',
        resave:true,
        saveUninitialized:true
    }));

//===== Passport 초기화 =====//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


var router = express.Router();
route_loader.init(app, router);

// 패스포트 설정
var passport_set = require('./config/passort_setting');
passport_set(app, passport);

// 패스포트 라우팅 설정
var passport_router = require('./routes/user_passport');
passport_router(router, passport);




//===== 404 Not found =====//
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);




// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database_loader.db) {
		database_loader.db.close();
	}
});


var server = http.createServer(app).listen(app.get('port'), app.get('ip'), function() {
    console.log('익스프레스로 웹서버 구동 시작 -> PORT : ' + app.get('port'));
    
    database_loader.init(app);
});