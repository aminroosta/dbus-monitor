module.exports = {
    server: {
      port: 8080,
      insert_random_data_every: 1000, /* set to zero to disable, this is just for testing */
    },
    db: {
      host     : 'localhost',
      user     : 'root',
      password : ''
    },
    database: 'awesome-db',
    drop_and_create: false, /* drop existing database and recreate it */
    tables: [
      {
        name: 'left-table',
        primary_key: 'id',
        fields: {
          'id': 'INT NOT NULL AUTO_INCREMENT',
          'name': 'VARCHAR(100)',
          'address': 'VARCHAR(200)'
        }
      },
      {
        name: 'right-table',
        primary_key: 'id',
        fields: {
          'id': 'INT NOT NULL AUTO_INCREMENT',
          'name': 'VARCHAR(100)',
          'address': 'VARCHAR(200)',
          'message': 'VARCHAR(4000)'
        }
      },
    ],
};
