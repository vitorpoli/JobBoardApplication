import "dotenv/config";
import mysql from "mysql2";

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

con.connect(function(err) {
  if (err) {
    console.error("Error connecting to DB:", err.stack);
    return;
  }
  console.log("Database connection established");
});

export default con;
