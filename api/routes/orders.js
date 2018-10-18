const express = require('express');

const router = express.Router();

router.get('/', (req ,res, next)=>{
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req ,res, next)=>{
    //create a new order
    const newOrder = {
        productId : req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Orders was created',
        createOrder: newOrder
    });
});

router.get('/:orderId', (req ,res, next)=>{
    res.status(200).json({
        message: 'Orders details',
        id: req.params.orderId
    });
});

router.delete('/:orderId', (req ,res, next)=>{
    res.status(200).json({
        message: 'Orders deleted',
        id: req.params.orderId
    });
});
module.exports = router;