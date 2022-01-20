const db = require('../db/db.js');
const Axios = require('axios');

var routes = {
  getReviews: (req, res) => {
    console.log('hit');
    let {page, count, sort, product_id} = req.query;
    let response = {"product": product_id, "page": page || 0, "count": count || 5, "results":[]};
    let products;
    let counter = 0;

    db.query('SELECT * FROM Reviews WHERE product_id = (?) AND reported = (?)', [product_id, 'false'], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //Removes unwanted strings before objects in result
        products = Object.values(JSON.parse(JSON.stringify(result)));
        products.forEach(p => {
          // Delete unneccessary key-value pairs
          delete p['reported'];
          delete p['product_id'];
          delete p['reviewer_email'];
          // Convert values to respective data types
          p['response'] = p['response']=== 'null' ? null:p['response'];
          p['recommend'] = p['recommend'] === 'false' ? false:true;

          db.query('SELECT id, url FROM Photos WHERE review_id = (?)', [p['review_id']], (err, result) => {
            if (err) {
              console.log(err);
            } else if (result.length !== 0) {
              p['photos'] = result;
            } else {
              p['photos'] = [];
            }
            response.results.push(p);
            if (counter === count - 1 || counter === products.length - 1) {
              res.status(200);
              res.send(response);
            }
            counter++;
          })
        })
      }
    })
  },

  getMetaData: (req, res) => {
    let {product_id} = req.query;
    let response = {"product_id": product_id, "ratings": {"1":'0', "2":'0', "3":'0', "4":'0', "5":'0'}, "recommended": {"false":'0', "true":'0'}, "characteristics":{}};
    let products;
    let counter = 0;
    let q;
    let ids;

    db.query('SELECT * FROM Reviews WHERE product_id = (?) AND reported = (?)', [product_id, 'false'], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query('SELECT id, name FROM Characteristics WHERE product_id = (?)', [product_id], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            q = '(' + ('(?),'.repeat(result.length));
            q = q.slice(0, q.length-1);
            q += ')'
            ids = result.map((obj) => {
              return obj['id'];
            })
            result.forEach(char => {
              let val = 0;
              response['characteristics'][`${char['name']}`] = {"id": Number(char['id']), "value": val}
            })


            db.query(`SELECT characteristic_id, value FROM CharacteristicReviews WHERE characteristic_id IN ${q}`, ids, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                let charValues = {};
                result.forEach(obj => {
                  if (charValues[obj['characteristic_id']] == null) {
                    charValues[obj['characteristic_id']] = [obj['value'] , 1]
                  } else {
                    charValues[obj['characteristic_id']][0] += obj['value'];
                    charValues[obj['characteristic_id']][1] += 1;
                  }
                });

                for (obj in response['characteristics']) {
                  response['characteristics'][obj]['value'] = (charValues[response['characteristics'][obj]['id']][0] / charValues[response['characteristics'][obj]['id']][1]).toString();
                }
                res.send(response);
              }
            });


          }
        });
        //Removes unwanted strings before objects in result
        products = Object.values(JSON.parse(JSON.stringify(result)));
        products.forEach(p => {
          let rating = response['ratings'][p['rating'].toString()];
          let recommend = response['recommended'][p['recommend'].toString()];

          rating = Number(rating) + 1;
          recommend = Number(recommend) + 1;

          response['ratings'][p['rating'].toString()] = rating.toString();
          response['recommended'][p['recommend'].toString()] = recommend.toString();
        })
      }
    })
  },

  post: (req, res) => {
    let {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = req.body;
    let review_id;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    let characteristic_ids = Object.keys(characteristics);
    let characteristic_values = Object.values(characteristics);


    db.query('INSERT INTO Reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date, reported) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [product_id, rating, summary, body, recommend, name, email, dateTime, 'false'], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        review_id = result['insertId'];
        let data = [];
        let rowArgs = [];
        let query;

        for (let i = 0; i < characteristic_ids.length; i++) {
          let charId = characteristic_ids[i];
          let charVal = characteristic_values[i];
          rowArgs.push("(?, ?, ?)");
          data.push(charId);
          data.push(review_id);
          data.push(charVal);
        }

        rowArgs = rowArgs.join(", ");
        query = `INSERT INTO CharacteristicReviews (characteristic_id, review_id, value) VALUES ${rowArgs}`;

        db.query(query, data, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            review_id = result['insertId'];
            let data = [];
            let rowArgs = [];
            let query;

            for (let i = 0; i < photos.length; i++) {
              let photo = photos[i];
              rowArgs.push("(?, ?)");
              data.push(review_id);
              data.push(photo);
            }

            rowArgs = rowArgs.join(", ");
            query = `INSERT INTO Photos (review_id, url) VALUES ${rowArgs}`;

            db.query(query, data, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send(result);
              }
            });
          }
        });
      }
    });
  },

  helpful: (req, res) => {
    let {name, quantity, id} = req.body;
    console.log(req.url);
    let review_id = req.url.split('/')[2];
    db.query('UPDATE Reviews SET helpfulness = helpfulness + 1 WHERE review_id = (?)', [review_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200);
        res.send(result);
      }
    })
  },

  report: (req, res) => {
    let {name, quantity, id} = req.body;
    let review_id = req.url.split('/')[2];
    db.query('UPDATE Reviews SET reported = (?) WHERE review_id = (?)', ['true', review_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(name, quantity, id);
        res.status(200);
        res.send(result);
      }
    })
  }
};

module.exports = routes;
