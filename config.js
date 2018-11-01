const config = {
  development: {
    db: {
      database: 'thesisdb',
      user: 'postgres',
      password: '12345',
      host: 'localhost',
      port: 5432
     // ssl: true
    },
    nodemailer: {
    }
  },
  production: {
    db: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: 5432
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;
