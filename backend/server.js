const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'your_secret_key';

// Đăng ký
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  userModel.createUser(username, password, (err) => {
    if (err) return res.status(400).json({ message: 'Username đã tồn tại' });
    res.json({ message: 'Đăng ký thành công' });
  });
});

// Đăng nhập
app.post('/auth/login', (req, res) => {
  const { username, password, remember } = req.body;
  userModel.findUser(username, (err, user) => {
    if (!user) return res.status(401).json({ message: 'sai thông tin đăng nhập' });
    const bcrypt = require('bcryptjs');
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'sai thông tin đăng nhập' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: remember ? '7d' : '1h' });
    res.json({ token });
  });
});

// Middleware xác thực token
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
    req.user = decoded;
    next();
  });
}

// Route test
app.get('/home', authMiddleware, (req, res) => {
  res.json({ message: 'Chào mừng đến trang chủ', user: req.user });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000')); 