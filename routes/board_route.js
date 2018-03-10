
// html-entities module is required in showpost.ejs
var Entities = require('html-entities').AllHtmlEntities;


var addpost = function(req, res) {
	console.log('post 모듈 안에 있는 addpost 호출됨.');
    
    if( !req.user) {
        console.log('사용자 인증 안된 상태임.');
        return res.redirect('/');
    }
    
    console.log(req.user);
    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.user.email;
	
    console.log('요청 파라미터 : ' + paramTitle + ', ' + paramContents + ', ' + 
               paramWriter);
    
	var database = req.app.get('database');
	
	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		
		// 1. 아이디를 이용해 사용자 검색
		database.UserModel.findByEmail(paramWriter, function(err, results) {
			if (err) {
                console.error('게시판 글 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }

			if (results == undefined || results.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 [' + paramWriter + ']를 찾을 수 없습니다.</h2>');
				res.end();
				
				return;
			}
			
			var userObjectId = results[0]._doc._id;
			console.log('사용자 ObjectId : ' + paramWriter +' -> ' + userObjectId);
			
			// save()로 저장
			// BoardModel 인스턴스 생성
			var board = new database.BoardModel({
				title: paramTitle,
				contents: paramContents,
				writer: userObjectId
			});

			board.savePost(function(err, result) {
                if (err) {
                    console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
                    // 인증 안된 경우
                    if (!req.user) {
                        console.log('사용자 인증 안된 상태임.');
                        return res.render('404.ejs', {login_success:false});
                    } else {
                        console.log('사용자 인증된 상태임.');
                        if (Array.isArray(req.user)) {
                            return res.render('404.ejs', {login_success:true, user: req.user[0]._doc});
                        } else {
                            return res.render('404.ejs', {login_success:true, user: req.user});
                        }
                    }
                }
				
			    console.log("글 데이터 추가함.");
			    console.log('글 작성', '포스팅 글을 생성했습니다. : ' + board._id);
			    
			    return res.redirect('/showpost/' + board._id); 
			});
			
		});
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

var listpost = function(req, res) {
	console.log('post 모듈 안에 있는 listpost 호출됨.');
  
    var paramPage = req.body.page || req.query.page || 0;
    var paramPerPage = req.body.perPage || req.query.perPage || 20;
	
    console.log('요청 파라미터 : ' + paramPage + ', ' + paramPerPage);
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 글 리스트
		var options = {
			page: paramPage,
			perPage: paramPerPage
		}
		
		database.BoardModel.list(options, function(err, results) {
			if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
 
				// 전체 문서 객체 수 확인
				database.BoardModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
                    if (count < paramPerPage) {
                        paramPerPage = count;
                    }
					// 뷰 템플레이트를 이용하여 렌더링한 후 전송
					var context = {
						title: '글 목록',
						posts: results,
						page: parseInt(paramPage),
						pageCount: Math.ceil(count / paramPerPage),
						perPage: paramPerPage, 
						totalRecords: count,
						size: paramPerPage
					};
                    
                        // 인증 안된 경우
                    if (!req.user) {
                        console.log('사용자 인증 안된 상태임.');
                        context.login_success = false;
                    } else {
                        if (Array.isArray(req.user)) {
                            context.login_success = true;
                            context.user = req.user[0]._doc;
                        } else {
                            context.login_success = true;
                            context.user = req.user;
                        }
                    }   
					
					req.app.render('listpost', context, function(err, html) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 목록 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};


var showpost = function(req, res) {
	console.log('post 모듈 안에 있는 showpost 호출됨.');
  
    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;
	
    console.log('요청 파라미터 : ' + paramId);
    
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		// 1. 글 리스트
		database.BoardModel.load(paramId, function(err, results) {
			if (err) {
                console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
			if (results) {
                
                
                // 조회수 업데이트
                console.log('trying to update hits.');
                
                database.BoardModel.incrHits(results._doc._id, function(err2, results2) {
                    console.log('incrHits executed.');
                    
                    if (err2) {
                        console.log('incrHits 실행 중 에러 발생.');
                        console.dir(err2);
                        return;
                    }
                    
                });
                
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				
                
                // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                
				var context = {
					title: '글 조회 ',
					posts: results,
					Entities: Entities
				};
                
                // 인증 안된 경우
                if (!req.user) {
                    console.log('사용자 인증 안된 상태임.');
                    context.login_success = false;
                } else {
                    if (Array.isArray(req.user)) {
                        context.login_success = true;
                        context.user = req.user[0]._doc;
                    } else {
                        context.login_success = true;
                        context.user = req.user;
                    }
                }   
                
				req.app.render('showpost', context, function(err, html) {
					if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
                
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
					res.end(html);
				});
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

var addcomment = function(req, res) {
	console.log('post 모듈 안에 있는 addcomment 호출됨.');
    
    if( !req.user) {
        console.log('사용자 인증 안된 상태임.');
        return res.redirect('/');
    }
    
    var paramId = req.body.id || req.query.id;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.user._id;
	
    if (!paramContents) {
        console.log('입력한 데이터 없음');
        return res.redirect('/showpost/' + paramId); 
    }
    
    console.log('요청 파라미터 : ' + paramId + ', ' + paramContents + ', ' + 
               paramWriter);
    
	var database = req.app.get('database');
	
	// 데이터베이스 객체가 초기화된 경우
	if (database.db) {
		
		// 1. 아이디를 이용해 사용자 검색
		database.BoardModel.findByIdAndUpdate(paramId,
            {'$push': {'comments':{'contents':paramContents, 'writer':paramWriter}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('게시판 댓글 추가 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>게시판 댓글 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                console.log("글 데이터 추가함.");
                console.log('글 작성', '포스팅 글을 생성했습니다. : ' + paramId);

                return res.redirect('/showpost/' + paramId); 
        });
 
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};

module.exports.listpost = listpost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
module.exports.addcomment = addcomment;
