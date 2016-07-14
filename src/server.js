var restify = require('restify');
var config = require('./config.js');

var srv = restify.createServer();
srv.use(restify.queryParser());
srv.use(restify.jsonp());

srv.get('/tables', function (req, res, next) {
    var tables = config.tables.map(function(table) {
      return {
        name: table.name,
        fields: Object.keys(table.fields).map(k => k.charAt(0).toUpperCase() + k.slice(1)) /* make fields upper case */
      }
    })
    res.send(tables);
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
