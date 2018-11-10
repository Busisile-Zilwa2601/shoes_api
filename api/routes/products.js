module.exports = function apiCalls(productService) {
    const express = require('express');
    const router = express.Router();
    router.get('/', async(req, res, next) => {
        try{
            let results = await productService.all();
            res.status(200).json({
                message: 'Handling GET request returning all shoes',
                data: results
            });
        }catch(err){
            next(err);
        }
    });
    router.post('/', async (req, res, next) => {
        //creating a new product
        let brand = req.body.brand;
        let prices = req.body.price;
        let in_stock = req.body.in_stock;
        //id: 'image' + req.body.id,
        let size = req.body.size;
        let color =  req.body.color;
        let shoeName = req.body.shoeName;
        let newProduct = {
            brand, 
            shoeName,
            color,
            size,
            price,
            in_stock
        };
        try{
            await addToBrand(brand);
            await addToColor(color);
            await addToShoeName(shoeName);
            await addToSizes(size);
            await addToProducts(in_stock,brand, color, shoeName, size, prices);
            res.status(201).json({
                message: 'Handling Post request, adding a new shoe or updating a stock of an existing shoe',
                createdProduc: newProduct
            });

        }catch(err){
            next(err);
        }
    });
    //return only the brands available
    router.get('/brand', async (req, res, next) => {
        try {
            let results = await productService.allBrands();
            res.status(200).json({
                message: 'Handle Get request, return all brands on database',
                brand: results
            });
        } catch (err) {
            next(err);
        }
    });
    //return all shoes of the given brand
    router.get('/brand/:brandname', async(req, res, next) => {
        const brand = req.params.brandname;
        try{
            if (isNaN(brand)) {
                let results = await productService.byBrand(brand);
                res.status(200).json({
                    message: 'Handle Get request, return all shoes of brand on '+ brand,
                    data: results
                });
            } else {
                console.log("error");
            }
        }catch(err){
            next(err);
        }
        
    });
    //return shoes by id
    router.get('/size/:productsSize', async(req, res, next) => {
        const size = req.params.productsSize;
        try{
            let results = await productService.bySize(size);
            res.status(200).json({
                message: 'You are returning all shoes of size: ' + size,
                data: results
            });
        }catch(err){
            next(err);
        }
        
    });
    //return all shoes of a brand and size
    router.get('/brand/:brandname/size/:productSize', async(req, res, next) => {
        const brand = req.params.brandname;
        const size = req.params.productSize;
        try{
            if (isNaN(brand)) {
                let results = await productService.brandOfSize(brand,size);
                res.status(200).json({
                    message: 'Handle Get request, return all shoes of a brand and size',
                    data: results  
                });
            }
        }catch(err){
           next(err); 
        }
    });
    // a route to to update the product
    router.patch('/sold/:productId', (req, res, next) => {
        id = req.params.productId;
        res.status(201).json({
            message: 'UPDATE a shoe of id: ' + id + ' on /shoes'

        });
    });
    // a route to to delete the product
    router.delete('/:productId', (req, res, next) => {
        id = req.params.productId;
        res.status(200).json({
            message: 'DELETE shoe of an id: ' + id + ' on /shoes'
        });
    });
    return{
        router
    }
}
