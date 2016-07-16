Project files
===
* `src/config.js` : Configurations for app & database.
* `src/mysql.js`  : Creates, querys and updates the database.
* `src/server.js` : Runs the http server on `0.0.0.0:8080`

How to install
===
* Make sure mysql is running `mysql.server start`
* Install npm packages `npm install`
* Configure `server.port:8080` in `src/config.js` file.
* Cofingure `drop_and_create`, `insert_random_data_every` in `src/config.js` file.
* run server `node src/server.js`
* open your browser on `localhost:8080`

Whats next?
===
* open `src/server.js` and implement the `TODO` parts.

```js
srv.put('/monitor/file', function (req, res, next) {
    var file = req.files.file;
    if(!file) return next(new Error("No file found in the request!"));
    var new_path = config.server.upload_dir + '/' + file.name;
    fs.renameSync(file.path, new_path);
    /* TODO: talk to dbus server. 'new_path' it the file address of apploaded file. */
    res.send({ok: true, path: new_path});
    next();
    });

srv.get('/mointor/all', function (req, res, next) {
    /* TODO: talk to dbus server.*/
    res.send({ok: true})
    next();
    });

srv.get('/mointor/pause', function (req, res, next) {
    /* TODO: talk to dbus server.*/
    res.send({ok: true})
    next();
    });
```
