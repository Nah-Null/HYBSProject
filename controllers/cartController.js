const Cart = require('../models/cartModel');
const Product = require('../models/product');
// const Order = require('../models/orderModel');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId; // สมมติว่ามีการจัดการ session สำหรับผู้ใช้

    try {
        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).send('Product not found');
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({
                productId: product.productId,
                name: product.product_name,
                price: product.price,
                quantity: parseInt(quantity),
                image: product.image
            });
        }

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send(`Error adding to cart: ${err.message}`);
    }
};

exports.getCart = async (req, res) => {
    const userId = req.session.userId; // สมมติว่ามีการจัดการ session สำหรับผู้ใช้

    try {
        const cart = await Cart.findOne({ userId });
        let total = 0;
        if (cart && cart.items.length > 0) {
            total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
        res.render('cart', { cart, total });
    } catch (err) {
        console.error('Error retrieving cart:', err);
        res.status(500).send(`Error retrieving cart: ${err.message}`);
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.session.userId; // สมมติว่ามีการจัดการ session สำหรับผู้ใช้

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        cart.items = cart.items.filter(item => item.productId !== productId);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send(`Error removing from cart: ${err.message}`);
    }
};

exports.checkout = async (req, res) => {
    const userId = req.session.userId; // สมมติว่ามีการจัดการ session สำหรับผู้ใช้
    const { address } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], address });
        } else {
            cart.address = address; // บันทึกที่อยู่ของลูกค้า
        }

        await cart.save();

        res.redirect('/payment');
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).send(`Error during checkout: ${err.message}`);
    }
};

exports.showPaymentPage = (req, res) => {
    res.render('payment');
};

exports.showthaiqr = (req, res) => {
    res.render('thaiqr');
};

exports.processPayment = async (req, res) => {
    const userId = req.session.userId; // สมมติว่ามีการจัดการ session สำหรับผู้ใช้
    const { cardNumber, expiryDate, cvv } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        // สมมติว่าการชำระเงินสำเร็จ
        const order = new Order({
            userId,
            items: cart.items,
            total: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            address: cart.address
        });

        await order.save();
        await Cart.deleteOne({ userId });

        res.send('Payment successful and order placed!');
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).send(`Error processing payment: ${err.message}`);
    }
};
