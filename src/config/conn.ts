import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.dbHost,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
});

export default pool;
