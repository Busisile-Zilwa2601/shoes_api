const express = require('express');

const router = express.Router();
router.get('/', (req ,res, next)=>{
    res.status(200).json({
        message: 'Handling GET request returning all shoes from /shoes'
    });
});
router.post('/', (req ,res, next)=>{
    //creating a new product
    const newProduct = {
        brand: req.body.brand,
        price: req.body.price, 
        in_stock: req.body.in_stock,
        id: 'image'+ req.body.id,
        size: req.body.size,
        color: req.body.color
    }
    res.status(201).json({
        message: 'Handling Post request, adding a new shoe to /shoes',
        createdProduc: newProduct
    });
});
//return shoes by brand
router.get('/:productBrand', (req, res, next)=>{
    const brand = req.params.productBrand;
    if(isNaN(brand)){
        res.status(200).json({
            message: 'Handle Get request, return all shoes of brand on /shoes',
            brand: brand
        });
    }else{
        next();
    } 
});
//return shoes by id
router.get('/:productsSize', (req,res, next)=>{
    const size = req.params.productsSize;
    res.status(200).json({
        size : size,
        message: 'You are returning all shoes of size: '+ size
    });
});
//return all shoes of a brand and size
router.get('/:productBrand/:productsSize', (req, res, next)=>{
    const brand = req.params.productBrand;
    const size = req.params.productsSize;
    if(isNaN(brand)){
        res.status(200).json({
            message: 'Handle Get request, return all shoes of a brand and size on /shoes',
            brand: brand,
            size: size
        });
    }    
});
// a route to to update the product
router.patch('/:productId', (req,res, next)=>{
    id = req.params.productId;
    res.status(201).json({
        message: 'UPDATE a shoe of id: '+id+ ' on /shoes'

    });
});
// a route to to delete the product
router.delete('/:productId', (req,res, next)=>{
    id = req.params.productId;
    res.status(200).json({
        message: 'DELETE shoe of an id: '+id+ ' on /shoes'
    });
});
module.exports = router;