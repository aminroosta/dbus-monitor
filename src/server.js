var restify = require('restify');
var config = require('./config.js');
var mysql = require('./mysql.js');

var srv = restify.createServer();
srv.use(restify.queryParser({ mapParams: true }));
srv.use(restify.jsonp());

srv.get('/tables', function (req, res, next) {
    var capitalize = k => k.charAt(0).toUpperCase() + k.slice(1);
    var tables = config.tables.map(function(table) {
      return {
        name: capitalize(table.name),
        fields: Object.keys(table.fields).map(capitalize) /* make fields upper case */
      }
    })
    res.send(tables);
    next();
});

srv.get('/query/:table_name/:last_id', function (req, res, next) {
    mysql.select(req.params.table_name, req.params.last_id)
        .then(data => {
          res.send(data);
          next();
        })
        .catch(err => {
          console.error(err);
          next(err);
        });
});

srv.post('/monitor/file', function (req, res, next) {
  console.warn(req.params);
  if(!req.params.name) return next(new Error('parameter "name" is missing'));
  if(!req.params.content) return next(new Error('"content" of file is missing'));
  console.warn('------------------------------');
  return

    mysql.select(req.params.table_name, req.params.last_id)
        .then(data => {
          res.send(data);
          next();
        })
        .catch(err => {
          console.error(err);
          next(err);
        });
});


/* server static files */
srv.get(/.*/, restify.serveStatic({
    'directory': 'static',
    'default': 'index.html'
}));


mysql
  .init()
  .then(() => srv.listen(config.server.port,
    () => console.log('server ready on %s', srv.url)
  ))
  .then(() => {
    config.insert_random_data_every &&
      mysql.insert_random_data_every(config.insert_random_data_every);
  })
  .catch(err => console.error(err));
