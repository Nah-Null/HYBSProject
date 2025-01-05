const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        // สมมติว่าคุณมี userId ใน session หรือใน request body
        const userId = req.session.userId || req.body.userId;

        if (!userId) {
            return res.status(400).render('login');
        }

        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // ส่งข้อมูลผู้ใช้ไปยังเทมเพลต
        res.render('Member', {
            UserData: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};