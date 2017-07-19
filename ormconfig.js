module.exports = [
  {
    "name": "localhost",
    "driver": {
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "repairlink",
      "password": "password",
      "database": "repairlink"
    },
    "autoSchemaSync": true,
    "entities": [
      "dist/entity/*.js"
    ],
    "subscribers": [
      "dist/subscriber/*.js,"
    ],
    "migrations": [
      "dist/migrations/*.js"
    ],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscriber"
    }
  },
  {
    "name": "prod",
    "driver": {
      "type": "postgres",
      "url": process.env.DATABASE_URL,
      extra: {
        ssl: true
      }
    },
    "autoSchemaSync": true,
    "entities": [
      "dist/entity/*.js"
    ],
    "subscribers": [
      "dist/subscriber/*.js,"
    ],
    "migrations": [
      "dist/migrations/*.js"
    ],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscriber"
    }
  }
];