var route_loader = {};

var config = require('../config/config');

route_loader.init = function(app, router) {
    console.log('route_loader.init 시작');
    
    initRoutes(app, router);
    
    console.log('route_loader.init 종료');
}

function initRoutes(app, router) {
    
    for (var i = 0; i < config.route_info.length; i++) {
        var curItem = config.route_info[i];
        
        var curModule = require(curItem.file);
        if(curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
            console.log('Path : ' + curItem.path + ' -> init 성공(GET)!' );
        } else if(curItem.type == 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
            console.log('Path : ' + curItem.path + ' -> init 성공!(POST)' );
        } else {
            console.error('라우팅 함수의 타입을 알 수 없습니다 : ' + curItem.type);
        }
        
    }
    
    app.use('/', router);
}

module.exports = route_loader;