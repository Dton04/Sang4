const db = require('../db');
const bcrypt = require('bcryptjs');

exports.createUser = (username, password, cb) => {
  const hash = bcrypt.hashSync(password, 8);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], cb);
};

exports.findUser = (username, cb) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], cb);
}; 