const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Hàm mã hóa mật khẩu
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12));

// Dịch vụ đăng ký
const registerService = ({ phone, password, name }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { phone },
            defaults: {
                phone,
                name,
                password: hashPassword(password),
                id: uuidv4()
            }
        });
        const token = response[1] && jwt.sign({ id: response[0].id, phone: response[0].phone }, process.env.SECRET_KEY, { expiresIn: '2d' });
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Register is successfully !' : 'Phone number has been already used !',
            token: token || null
        });

    } catch (error) {
        reject(error);
    }
});

// Dịch vụ đăng nhập
const loginService = ({ phone, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { phone },
            raw: true
        });
        const isCorrectPassword = response && bcrypt.compareSync(password, response.password);
        const token = isCorrectPassword && jwt.sign({ id: response.id, phone: response.phone }, process.env.SECRET_KEY, { expiresIn: '2d' });
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Login is successfully !' : response ? 'Password is wrong !' : 'Phone number not found !',
            token: token || null
        });

    } catch (error) {
        reject(error);
    }
});

// Xuất khẩu các dịch vụ
module.exports = {
    registerService,
    loginService
};
