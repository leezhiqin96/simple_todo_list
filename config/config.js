require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT_DEV,
    logging: false
  },
  production: {
    // Use DATABASE_URL from Heroku environment variables
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For self-signed certificates
      }
    }
  }
};
