const Product = require('../models/product'); // อย่าลืมตรวจสอบเส้นทางให้ถูกต้อง

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.render('product', { 
            products,
            part: req.originalUrl
        });
    } catch (err) {
        console.error('Error retrieving products:', err); // แสดงข้อความข้อผิดพลาด
        res.status(500).send(`Error retrieving products: ${err.message}`);
    }
};

exports.getProductById = async (req, res, productId) => {
    try {
        const product = await Product.findOne({ productId: productId });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('product', { 
            products: [product],
            part: req.originalUrl
        });
    } catch (err) {
        console.error('Error retrieving product:', err); // แสดงข้อความข้อผิดพลาด
        res.status(500).send(`Error retrieving product: ${err.message}`);
    }
};