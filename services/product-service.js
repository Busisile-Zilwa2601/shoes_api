module.exports = function ProductService(pool){
    //view all shoes
    async function all(){
        let results = await pool.query('select brands.brand_name, colors.color_name, shoe_names.name, sizes.size, products.in_stock, products.prices from products join brands on products.brand_id= brands.id join colors on products.color_id= colors.id join shoe_names on products.shoe_name_id = shoe_names.id join sizes on products.size_id = sizes.id');
        return results.rows;
    }
    //return all the brand names
    async function allBrands(){
        let results = await pool.query('select brand_name from brands');
        return results.rows;
    }
    //view shoes of a brand
    async function byBrand(myBrand){
        let results;
        if(await checkBrand(myBrand)){
            let brand = await getBrand(myBrand);
            let brand_id = brand.id;
            results = await pool.query('select brands.brand_name, colors.color_name, shoe_names.name, sizes.size, products.in_stock, products.prices from products join brands on products.brand_id= brands.id join colors on products.color_id= colors.id join shoe_names on products.shoe_name_id = shoe_names.id join sizes on products.size_id = sizes.id Where products.brand_id = $1', [brand_id]);
            
        }else{
            results.rows = null;
        }
        return results.rows;
    }
    //filter by brand and size
    async function brandOfSize(brandname, numSize){
        //get size id
        let size = await getSizeId(numSize);
        let size_id = size.id;
        //get brand id
        let brand = await getBrand(brandname);
        let brand_id = brand.id;
        let results = await pool.query('select brands.brand_name, colors.color_name, shoe_names.name, sizes.size, products.in_stock, products.prices from products join brands on products.brand_id= brands.id join colors on products.color_id= colors.id join shoe_names on products.shoe_name_id = shoe_names.id join sizes on products.size_id = sizes.id WHERE products.brand_id = $1 AND products.size_id = $2', [brand_id, size_id]);
        return results.rows;
    }
    //filter by size
    async function bySize(numSize){
        //get size id
        let size = await getSizeId(numSize);
        let size_id = size.id;
        let results = await pool.query('select brands.brand_name, colors.color_name, shoe_names.name, sizes.size, products.in_stock, products.prices from products join brands on products.brand_id= brands.id join colors on products.color_id= colors.id join shoe_names on products.shoe_name_id = shoe_names.id join sizes on products.size_id = sizes.id WHERE products.size_id = $1', [size_id]);
        return results.rows;
    }
    //--------------------------------------------------------------------------------------------
    /*
    * The following functions will check existance of:
    *  1) Brand
    *  2) Color
    *  3) Shoe name
    *  4) Size
    *  5) product 
    */
    //check if the brand exist
    async function checkBrand(brandName) {
        let results = await pool.query('select * from brands where brand_name =$1', [brandName]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //check if the color exist
    async function checkColor(colorName) {
        let results = await pool.query('select * from colors where color_name =$1', [colorName]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //check the name
    async function checkShoeName(shoe_name){
        let results = await pool.query('select * from shoe_names where color_name =$1', [shoe_name]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //check the size
    async function checkSize(shoe_size){
        let results = await pool.query('select * from sizes where size =$1', [shoe_size]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //check a product
    async function checkProduct(brand_id,color_id, shoe_id, size_id){
        let results = await pool.query('select brands.brand_name, colors.color_name, shoe_names.name, sizes.size, products.in_stock, products.prices from products join brands on products.brand_id= brands.id join colors on products.color_id= colors.id join shoe_names on products.shoe_name_id = shoe_names.id join sizes on products.size_id = sizes.id WHERE products.brand_id = $1 AND products.color_id=$2 AND products.shoe_name_id = $3 AND products.size_id = $4', [brand_id, color_id, shoe_id, size_id]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //---------------------------------------------------------------------------------------
    /*
    * The following functions will return the following:
    *  1) Brand
    *  2) Color
    *  3) Shoe name
    *  4) Size 
    */
    // get a brand
    async function getBrand(brandName){
        let results;
        if(await checkBrand(brandName)){
            results = await pool.query('select * from brands where brand_name =$1', [brandName]);
        }else{
            results = null;
        }
        return results.rows[0];
    }
    // get the the color
    async function getColor(color){
        let results;
        if(checkColor(color)){
            results = await pool.query('select * from color where color_name = $1', [color]);
        }else{
            results = null;
        }
        return results.rows[0];
    }
    //get the shoe name
    async function getShoeName(shoe){
        let results = await pool.query('select * from shoe_names where name = $1', [shoe]);
        return results.rows[0];
    }
    //get the size
    async function getSizeId(size){
        let results = await pool.query('select * from sizes where size=$1', [size]);
        return results.rows[0];
    }
    //-------------------------------------------------------------------------------------------
    /* 
    *   adding to the brand table
    *   adding to the color table
    *   adding to the shoe names
    *   adding to the size table
    *   adding product table
    */
    async function addToBrand(brandname){
        if(!(await checkBrand(brandname))){
            await pool.query('insert into brands(brand_name) values($1)', [brandname]);
        }
    }
    async function addToColor(colorName){
        if(!(await checkColor(colorName))){
            await pool.query('insert into colors(color_name) values($1)', [colorName]);
        }
    }
    async function addToShoeName(shoeName){
        if(!(await checkShoeName(shoeName))){
            await pool.query('insert into shoe_names(name) values($1)', [shoeName]);
        }
    }
    async function addToSizes(sizeNum){
        if(!(await checkSize(sizeNum))){
            await pool.query('insert into sizes(size) values($1)', [sizeNum]);
        }
    }
    async function addToProducts(brandname, colorname, shoeName, sizeNum, in_stock, prices){
        //get the brand id of this brand from brands table
        let brand = await getBrand(brandname);
        let brand_id = brand.id;
        //get the color id of this color from the colors table
        let color = await getColor(colorname);
        let color_id = color.id;
        //get the shoes name id of this shoe name from the shoe_names table
        let shoeName = await getShoeName(shoeName);
        let shoeName_id = shoeName.id;
        //get id of this size from the size table
        let size = await getSizeId(sizeNum);
        let sizeId = size.id;
        //check if this shoe exists in the products table
        if(checkProduct(brand_id, color_id, shoeName_id, sizeId)){
            await pool.query('UPDATE products SET products.in_stock = products.in_stock+ in_stock WHERE products.brand_id = $1 AND products.color_id=$2 AND products.shoe_name_id = $3 AND products.size_id = $4', [brand_id, color_id, shoeName_id, sizeId]);
        }else{
            await pool.query('INSERT INTO products(in_stock, brand_id, color_id, shoe_name_id, size_id, prices) values($1, $2, $3, $4, $5, $6)',[in_stock,brand_id, color_id, shoeName_id, sizeId, prices] );
        }
    }
    return{
        all,
        allBrands,
        byBrand,
        bySize,
        brandOfSize,
        addToBrand,
        addToColor,
        addToShoeName,
        addToSizes,
        addToProducts
    }
}