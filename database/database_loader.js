var mongoose = require('mongoose');

var config = require('../config/config');

var database_loader = {};

database_loader.init = function(app) {
    console.log('database_loader.init 시작');
    
    connect(app, config);

};

function connect(app, config) {
    console.log('데이터베이스 연결 준비');
    
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database_loader.db = mongoose.connection;
    
    database_loader.db.on('open', function() {
        console.log('데이터베이스 연결 성공 : ' + config.db_url);
        createSchema(app, config);
    });
    
    database_loader.db.on('disconnected', function() {
        console.log('데이터베이스 연결 유실.')
    });
    
    database_loader.db.on('error', console.error.bind(console, 'mongoose  연결 에러.'));
    
}

function createSchema(app, config) {
    console.log('설정의 DB 스키마 수 : ' + config.db_schemas.length);
    for (var i = 0; i < config.db_schemas.length; i++) {
        var curItem = config.db_schemas[i];
        console.log('%s -> Schema 모듈 load', curItem.file);
        
        var curSchema = require(curItem.file).createSchema(mongoose);
        
        console.log('%s -> Schema 생성.', curItem.file);
        
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s -> %s 컬렉션 모델 정의', curItem.file, curItem.collection);
    
        database_loader[curItem.schemaName] = curSchema;
        database_loader[curItem.modelName] = curModel;
        console.log('스키마 [%s], 모델 [%s] 생성', curItem.schemaName, curItem.modelName);
    }
    app.set('database', database_loader);
    console.log('database_loader.init 종료');
};

module.exports = database_loader;