module.exports = {
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
    ]
};
