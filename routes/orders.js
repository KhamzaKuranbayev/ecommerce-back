const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const { Router } = require('express');
const { route } = require('./products');


/* Get all orders */
router.get('/', (req, res) => {

    database
        .table('orders_details as od')
        .join([{
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([
            'o.id',
            'p.title as name',
            'p.description',
            'p.price',
            'od.quantity as quantityOrdered',
            'p.image'
        ])
        .sort({ id: 1 })
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({ message: 'No orders found' });
            }
        })
        .catch(error => {
            console.log(error);
        });

});

/* Get single order  */
router.get('/:id', (req, res) => {

    const orderId = req.params.id;

    database
        .table('orders_details as od')
        .join([{
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({ 'o.id': orderId })
        .getAll()
        .then(order => {
            if (order) {
                res.status(200).json(order);
            } else {
                res.json({ message: `No order found with order id ${orderId} ` });
            }
        })
        .catch(error => {
            console.log(error);
        });

});

/* Add a new order */
router.post('/new', (req, res) => {

    let { userId, products } = req.body;

    if (userId !== null && userId > 0) {
        database
            .table('orders')
            .insert({
                user_id: userId
            })
            .then(newOrderId => {

                if (newOrderId > 0) {
                    products.forEach(async p => {

                        let data = await database.table('products').filter({ id: p.id }).withFields(['quantity']).get();
                        let incart = p.incart;

                        if (data.quantity > 0) {
                            data.quantity = data.quantity - incart;

                            if (data.quantity < 0) {
                                data.quantity = 0;
                            }

                        } else {
                            data.quantity = 0;
                        }

                        // INSERT ORDER DETAILS WRITE THE NEWLY GENERATED ORDER ID
                        database.table('orders_details')
                            .insert({
                                order_id: newOrderId,
                                product_id: p.id,
                                quantity: incart
                            }).then(newId => {

                                database.table('products')
                                    .filter({ id: p.id })
                                    .update({
                                        quantity: data.quantity
                                    }).then(successNum => {}).catch(error => console.log(error));


                            }).catch(error => console.log(error));
                    });
                } else {
                    res.json({ message: 'New order failed while adding order details', success: false });
                }

                res.json({
                    message: `Order successfully placed with order id ${newOrderId}`,
                    success: true,
                    order_id: newOrderId,
                    products: products
                });
            }).catch(error => console.log(error));

    } else {
        res.json({ message: 'New order failed', success: false });
    }

});

/* FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({ success: true });
    }, 3000);
});


module.exports = router;