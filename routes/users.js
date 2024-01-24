const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.authenticate(username, password);
      if (user) {
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect(user.role === 'admin' ? '/admin/add-prescription' : '/prescriptions/user/prescriptions');
      } else {
        res.render('login', { error: 'Invalid username or password.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/users/login');
    });
  });

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      console.log(`Username '${username}' is already taken.`);
      return res.redirect('/users/register');
    }
    await User.createUser(username, password);
    console.log(`User '${username}' registered successfully.`);
    req.session.user = username;
    res.redirect('/prescriptions/user/prescriptions');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
