const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');


/* GET all products. */
router.get('/', (req, res) => {

    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    let limit = (req.query.limit !== undefined && req.query.page !== 0) ? req.query.limit : 10;

    let startValue;
    let endValue;


    if (page > 0) {
        startValue = (page * limit) - limit;
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    database
        .table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields([
            'c.title as category',
            'p.title as product',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(products => {
            if (products.length > 0) {
                res.status(200).json({
                    count: products.length,
                    products: products
                });
            } else {
                res.json({message: 'No products founds'});
            }
        })
        .catch(err => {
            console.log(err)
        });


});

/* Get single product */
router.get('/:id', (req, res) => {

    let productId = req.params.id;

    database
        .table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields([
            'c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id'
        ])
        .filter({'p.id': productId})
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: `No product found with product id ${productId}`});
            }
        })
        .catch(err => {
            console.log(err)
        });
});

/* Get all products from one particular category */
router.get('/category/:catName', (req, res) => {


    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // set the current page number
    let limit = (req.query.limit !== undefined && req.query.page !== 0) ? req.query.limit : 10; // set the limit of items per page

    let startValue;
    let endValue;


    if (page > 0) {
        startValue = (page * limit) - limit; // 0, 10, 20, 30, ...
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    let cat_title = req.params.catName;

    database
        .table('products as p')
        .join([{
            table: 'categories as c',
            on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%' `
        }])
        .withFields([
            'c.title as category',
            'p.title as product',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(products => {
            if (products.length > 0) {
                res.status(200).json({
                    count: products.length,
                    products: products
                });
            } else {
                res.json({message: `No products found from ${cat_title} category. `});
            }
        })
        .catch(err => {
            console.log(err)
        });
});

module.exports = router;
