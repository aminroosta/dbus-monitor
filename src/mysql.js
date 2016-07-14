var mysql = require('mysql');
var config = require('./config.js');

var connection = null;
var logger = function() { console.warn(arguments); }

/* execute a query on the database */
function execute(str) {
  return new Promise((resolve, reject) =>
      connection.query(str, (err, rows, fields) => {
        if(err)
          return reject(err);
        return resolve(rows, fields);
      })
  );
}

function create_tables() {
  var promises = config.tables.map(table => {
    var query = `create table \`${table.name}\` (\n`;
    for(var col in table.fields)
      query += `${col} ${table.fields[col]},\n`;
    query += `PRIMARY KEY ( ${table.primary_key} )`;
    if(table.foreign_key)
      query +=`,FOREIGN KEY (${table.foreign_key}) REFERENCES ${table.references}`;
    query += '\n);';

    return execute(query);
  });
  return Promise.all(promises);
}

function init() {
    connection && connection.end();
    connection = mysql.createConnection(config.db);
    connection.connect();

    if(config.drop_and_create) { /* drop and create tables */
      return execute('drop database if exists `'+ config.database + '`;')
          .then(() => execute('create database `' + config.database + '`;'))
          .then(() => execute('use `' + config.database + '`;'))
          .then(() => create_tables())
          .catch(logger);
    }
    /* otherwise just select the database */
    return execute('use `' + config.database + '`;');
}

/* select rows from table_name where row.id > last_id
 * last_id is optional */
function select(table_name, last_id) {
  last_id = last_id || 0; /* select all rows if no last_id is provided */
    var query = `select * from \`${table_name}\` as tbl where tbl.id > ${last_id};`;
    return execute(query)
          .catch(err => {
            logger(err);
            return err;
          });
}

/* run an interval to insert random data into database tables. FOR DEBUG AND TEST PURPOSSES */
function insert_random_data_every(ms) {
  ms = ms || 500; /* 500 ms by default */
  var generate = () => `'${Math.random().toString(36).substr(2, 5)}'`; /* generate a random string */
  execute('insert into run (filename) values (\'test\')').catch(logger);
  setInterval(() => {
    config.tables.filter(t => t.name !== 'run').forEach(table => {
      var keys = Object.keys(table.fields).filter(key => key !== table.foreign_key && key !== table.primary_key );
      var values = keys.map(generate);

      table.foreign_key && keys.push(table.foreign_key);
      table.foreign_key && values.push(1);

      if(table.fields[table.primary_key].includes('AUTO_INCREMENT') == false){
        keys.push(table.primary_key);
        values.push(new Date()*1/100%1000000000|0);
      }

      var query = `insert into \`${table.name}\` (${keys.join(',')}) values (${values.join(',')})`;
      execute(query).catch(logger); /* insert the new row */
    })
  }, ms);
}

module.exports = {
  init: init,
  select: select,
  insert_random_data_every: insert_random_data_every
};
