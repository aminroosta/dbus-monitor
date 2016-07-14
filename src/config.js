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
    database: 'monitor',
    drop_and_create: true, /* drop existing database and recreate it */
    tables: [
      {
        name: 'process_list',
        primary_key: 'id',
        fields: {
          'id': 'INT NOT NULL',
          'name': 'VARCHAR(100)',
          'address': 'VARCHAR(100)'
        }
      },
      {
        name: 'run',
        primary_key: 'id',
        fields: {
          'id': 'INT NOT NULL AUTO_INCREMENT',
          'filename': 'VARCHAR(200)',
          'start': 'TIMESTAMP',
        }
      },
      {
        name: 'log',
        primary_key: 'id',
        foreign_key: 'run_id',
        references: 'run(id)',
        fields: {
          'id': 'INT NOT NULL AUTO_INCREMENT',
          'name': 'VARCHAR(100)',
          'address': 'VARCHAR(100)',
          'message': 'VARCHAR(200)',
          'type': 'VARCHAR(20)',
          'run_id': 'INT NOT NULL'
        }
      },
    ],
};
