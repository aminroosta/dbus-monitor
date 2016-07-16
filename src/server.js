var fs = require('fs');
var restify = require('restify');
var config = require('./config.js');
var mysql = require('./mysql.js');

var srv = restify.createServer();
srv.use(restify.queryParser({ mapParams: true }));
srv.use(restify.bodyParser({
  uploadDir: config.server.upload_dir
}));
srv.use(restify.jsonp());

srv.get('/tables', function (req, res, next) {
    var tables = config.tables.map(function(table) {
      return {
        name: table.name,
        fields: Object.keys(table.fields)
      }
    })
    res.send(tables);
    next();
});

srv.get('/query/log/:run_id/:last_id', function (req, res, next) {
    if(!req.params.run_id) return next(new Error('"run_id" parameter missing'));
    if(!req.params.last_id) return next(new Error('"last_id" parameter missing'));
    mysql.execute(`select * from log where log.id > ${req.params.last_id} and log.run_id = ${req.params.run_id};`)
        .then(data => {
          res.send(data);
          next();
        })
        .catch(err => {
          console.error(err);
          next(err);
        });
});

srv.get('/query/:table_name', function (req, res, next) {
    if(!req.params.table_name) return next(new Error('"table_name" parameter missing'));
    mysql.execute(`select * from ${req.params.table_name};`)
        .then(data => {
          res.send(data);
          next();
        })
        .catch(err => {
          console.error(err);
          next(err);
        });
});

srv.put('/monitor/file', function (req, res, next) {
  var file = req.files.file;
  if(!file) return next(new Error("No file found in the request!"));
  var new_path = config.server.upload_dir + '/' + file.name;
  fs.renameSync(file.path, new_path);
  res.send({ok: true, path: new_path});
  next();
});


srv.get('/mointor/all', function (req, res, next) {
  res.send({ok: true})
  next();
});
srv.get('/mointor/pause', function (req, res, next) {
  res.send({ok: true})
  next();
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
    config.server.insert_random_data_every &&
      mysql.insert_random_data_every(config.server.insert_random_data_every);
  })
  .catch(err => console.error(err));
