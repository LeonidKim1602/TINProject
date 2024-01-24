const db = require('../db');

class User {
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static getAllUsers() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username FROM users', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
  

  static createUser(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      db.run(sql, [username, password, 'user'], (err) => {
        if (err) reject(err);
        resolve('User created successfully');
      });
    });
  }

  static authenticate(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
      db.get(sql, [username, password], (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }
}

module.exports = User;
