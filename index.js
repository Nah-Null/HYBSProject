const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
// const userController = require('./controllers/userController');
require('dotenv').config();


// ตั้งค่า Session
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'your_default_secret_key', // ใช้ค่า SESSION_SECRET จาก .env หรือค่าเริ่มต้น
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // ตั้งค่า secure: true ถ้าใช้ HTTPS
}));

// MongoDB Connection
mongoose.connect(`mongodb+srv://Test1:${process.env.DB_PASSWORD}@test01.tfzqq.mongodb.net/?retryWrites=true&w=majority&appName=test01`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // เพิ่มระยะเวลา timeout เป็น 30 วินาที
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB Connection Error:', err.message);
});

global.loggedIn = null;

// Controllers
const indexController = require('./controllers/indexController');
const musicController = require('./controllers/MusicController');
const apparelController = require('./controllers/ApparelController');
const hmusicController = require('./controllers/hMusicController');
const happarelController = require('./controllers/hApparelController');
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');
const storeUserController = require('./controllers/storeUserController');
const loginUserController = require('./controllers/loginUserController');
const logoutController = require('./controllers/logoutController');
const homeController = require('./controllers/homeController');
const muController = require('./controllers/muUserController');
const memberController = require('./controllers/memberController');
const productController = require('./controllers/productController');
const productuserController = require('./controllers/productuserController');
const cartController = require('./controllers/cartController');


// ข้อมูลสินค้าตัวอย่าง
const products = [
    { id: 1, name: "Product1", category: "product1", image: "product1.jpg", price: "฿100" },
    { id: 2, name: "Product2", category: "product2", image: "product2.jpg", price: "฿150" },
    // เพิ่มข้อมูลสินค้าอื่นๆ
];




// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/vs'));
app.use(express.static('public/js'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(expressSession({
    secret: "node secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // ตั้งค่า secure: true ถ้าใช้ HTTPS
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
    loggedIn = req.session.userId;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});
app.set('view engine', 'ejs');

app.get('/', indexController);
app.get('/Music', musicController);
app.get('/Apparel', apparelController);
app.get('/hMusic', hmusicController);
app.get('/hApparel', happarelController);
app.get('/home', homeController);
app.get('/login', redirectIfAuth, loginController);
app.get('/register', redirectIfAuth, registerController);
app.post('/user/register', redirectIfAuth, storeUserController);
app.post('/user/login', redirectIfAuth, loginUserController);
app.get('/logout', logoutController);
app.get('/member',muController);


// ใช้เส้นทาง /product1 ถึง /product8
app.get('/HYBS-001', (req, res) => productController.getProductById(req, res, 'HYBS-001'));
app.get('/HYBS-002', (req, res) => productController.getProductById(req, res, 'HYBS-002'));
app.get('/HYBS-003', (req, res) => productController.getProductById(req, res, 'HYBS-003'));
app.get('/HYBS-004', (req, res) => productController.getProductById(req, res, 'HYBS-004'));
app.get('/HYBS-005', (req, res) => productController.getProductById(req, res, 'HYBS-005'));
app.get('/HYBS-006', (req, res) => productController.getProductById(req, res, 'HYBS-006'));
app.get('/HYBS-007', (req, res) => productController.getProductById(req, res, 'HYBS-007'));
app.get('/HYBS-008', (req, res) => productController.getProductById(req, res, 'HYBS-008'));

app.get('/HYBS-0011', (req, res) => productuserController.getProductById(req, res, 'HYBS-001'));
app.get('/HYBS-0012', (req, res) => productuserController.getProductById(req, res, 'HYBS-002'));
app.get('/HYBS-0013', (req, res) => productuserController.getProductById(req, res, 'HYBS-003'));
app.get('/HYBS-0014', (req, res) => productuserController.getProductById(req, res, 'HYBS-004'));
app.get('/HYBS-0015', (req, res) => productuserController.getProductById(req, res, 'HYBS-005'));
app.get('/HYBS-0016', (req, res) => productuserController.getProductById(req, res, 'HYBS-006'));
app.get('/HYBS-0017', (req, res) => productuserController.getProductById(req, res, 'HYBS-007'));
app.get('/HYBS-0018', (req, res) => productuserController.getProductById(req, res, 'HYBS-008'));

// เส้นทางสำหรับการเพิ่มสินค้าไปยัง Cart
app.post('/add-to-cart', cartController.addToCart);
app.post('/remove-from-cart', cartController.removeFromCart);
app.get('/cart', cartController.getCart);
app.get('/orders', cartController.getCart);
app.post('/checkout', cartController.checkout); // เส้นทางสำหรับการทำการสั่งซื้อ
app.get('/payment', cartController.showPaymentPage); // เส้นทางสำหรับการแสดงหน้าชำระเงิน
app.get('/process-payment', cartController.processPayment); // เส้นทางสำหรับการแสดงหน้าชำระเงิน
app.get('/QR', cartController.showthaiqr); // เส้นทางสำหรับการแสดงหน้าชำระเงิน

// app.post('/process-payment', cartController.processPayment); // เส้นทางสำหรับการประมวลผลการชำระเงิน

// เส้นทางสำหรับการแก้ไขโปรไฟล์
// app.post('/edit-profile', userController.editProfile);

app.listen(4000, () => {
    console.log("App listening on port 4000");
});
