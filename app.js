const express = require('express');
const bodyParser = require('body-parser');
let app = express();
let ProductService = require('./services/product-service');
const pg = require('pg');
let Pool = pg.Pool;
const morgan = require('morgan');

let productRoutes = require('./api/routes/products');
let ordersRoutes = require('./api/routes/orders');

//Using a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if(process.env.DATABASE_URL && !local){
    useSSL = true;
}

//the databse to use 
const connectionString = process.env.DATABASE_URL || 'postgresql://busisile:pg123@localhost/{my-database}'

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const productService = ProductService(pool);
//middware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS errors
app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/shoes', productRoutes);
app.use('/orders', ordersRoutes);

//Error handling
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports = app;