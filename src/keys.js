require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DATABASE } = process.env;

module.exports = {
  database: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
  },
};
