var restify = require('restify');

var srv = restify.createServer();
srv.use(restify.queryParser());
srv.use(restify.jsonp());

srv.get('/hello', function (req, res, next) {
    res.send({hello: 'world'});
    next();
});

/* server static files */
srv.get(/.*/, restify.serveStatic({
    'directory': 'static',
    'default': 'index.html'
}));

srv.listen(8080, function () {
    console.log('server ready on %s', srv.url);
});
