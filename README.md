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
* run server `node src/server.js`
