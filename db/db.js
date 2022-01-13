const mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'RatingsReviews'
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected!');
  }
});

module.exports = con;