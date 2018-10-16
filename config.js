const config = {
  development: {
    db: {
      database: 'd6qidmqffp0pd',
      user: 'ehvohapjwvjnjn',
      password: 'a6361456ac7202d9889bfc44c3b5099d615e1465f1e91c05ac85549b37411321',
      host: 'ec2-54-221-225-11.compute-1.amazonaws.com',
      port: 5432,
      ssl: true
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
      port: 5432,
      ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;
