const express = require('express');
const Medicine = require('../models/medicine');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.getAllMedicines();
    res.render('index', { user: req.session.user, medicines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
