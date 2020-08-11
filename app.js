var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser');
var express = require('express');
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, x-Requested-with, Accept");
    next();
});

var productRoute = require('./routes/products');
var ordersRoute = require('./routes/orders');
//var authRoute = require('./routes/auth');

app.use('/api/products', productRoute);
app.use('/api/orders', ordersRoute);
//app.use('/api/auth', authRoute);

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: 'Content-Type, Authorization, Origin, x-Requested-with, Accept, Save-Data, Viewport-Width, Width, DPR'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;