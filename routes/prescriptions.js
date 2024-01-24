const express = require('express');
const Prescription = require('../models/prescription');
const router = express.Router();

router.get('/user/prescriptions', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Permission Denied');
    }
    try {
        const prescriptions = await Prescription.findByUserId(req.session.user.id);
        res.render('user-prescriptions', { prescriptions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
