var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/local'

module.exports = {
    server_port:8080,
    db_url:connectionString,
    db_schemas: [
        {file:'./schema/user', collection:'Users', schemaName:'UserSchema', modelName:'UserModel'},
        {file:'./schema/board', collection:'Board', schemaName:'BoardSchema', modelName: 'BoardModel'}
    ],
    route_info: [
        {file:'./user_route', path:'/404', method:'err_404', type: 'get'},
        {file:'./user_route', path:'/', method:'home', type: 'get'},
        {file:'./user_route', path:'/about', method:'about' , type: 'get'},
        {file:'./user_route', path:'/rule', method:'rule' , type: 'get'},
        {file:'./user_route', path:'/history', method:'history' , type: 'get'},
        {file:'./user_route', path:'/members', method:'members' , type: 'get'},
        {file:'./user_route', path:'/addpost', method:'addpost', type: 'get'},
        {file:'./board_route', path:'/addpost', method:'addpost', type: 'post'},
        {file:'./board_route', path:'/showpost/:id', method:'showpost', type: 'get'},
        {file:'./board_route', path:'/listpost', method:'listpost', type: 'post'},
        {file:'./board_route', path:'/listpost', method:'listpost', type: 'get'},
        {file:'./board_route', path:'/addcomment', method:'addcomment', type: 'post'}
        
        
        
    ]
};