const mysql = require('mysql');

var con = mysql.createConnection({
  host: '44.201.159.250',
  port: 3306,
  user: 'foo',
  password: 'bar',
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
