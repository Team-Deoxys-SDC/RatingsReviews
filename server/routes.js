const db = require('../db/db.js');
const Axios = require('axios');

var routes = {
  get: (req, res) => {
    let {page, count, sort, product_id} = req.query;
    if (page == null) {
      page = 0;
    } else if (count == null) {
      count = 5;
    } else if (sort == null) {
      sort = 'newest'
    } else if (product_id == null) {
      res.send('Error, you must include product_id');
      return;
    }

    let response = {"product": product_id, "page": page, "count": count, "results":[]};
    let products;

    db.query('SELECT * FROM Reviews WHERE product_id = (?)', [product_id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200);
        products = result.map(product => {
          return product;
        });
      }

      console.log('products: ', products)
      var {id} = products;
      console.log('id: ', id);
    })

    // db.query('SELECT * FROM Photos WHERE product_id = (?)', [product_id], (err, result) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.status(200);
    //     products = result;
    //   }
    // })

    console.log(page, count, sort, product_id);
    res.send(page, count, sort, product_id);
  },

  post: (req, res) => {
    let {name, quantity} = req.body;
    db.query('INSERT INTO groceries (name, quantity) VALUES (?, ?)', [name, quantity], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(201);
        res.send(result);
      }
    })
  },

  put: (req, res) => {
    let {name, quantity, id} = req.body;
    db.query('UPDATE groceries SET name = (?), quantity = (?) WHERE id = (?)', [name, quantity, id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(name, quantity, id);
        res.status(200);
        res.send(result);
      }
    })
  },

  delete: (req, res) => {
    let {name, quantity} = req.body;
    console.log(name, quantity);
    db.query('DELETE FROM groceries WHERE name = (?) AND quantity = (?)', [name, quantity], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200);
        res.send(result);
      }
    })
  }
};

module.exports = routes;