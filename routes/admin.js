const express = require('express');
const Medicine = require('../models/medicine');
const Prescription = require('../models/prescription');
const User = require('../models/user');
const router = express.Router();

router.get('/add-prescription', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            const users = await User.getAllUsers();
            const medicines = await Medicine.getAllMedicines();
            res.render('admin-add-prescription', { users, medicines });
        } catch (err) {
            res.status(500).send('Server Error');
        }
    } else {
        res.status(403).send('Permission Denied');
    }
});

router.get('/view-all-prescriptions', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const allPrescriptions = await Prescription.getPrescriptionsWithDetailsPaginated(limit, offset);
            const totalPrescriptions = await Prescription.countPrescriptions();
            const totalPages = Math.ceil(totalPrescriptions / limit);

            res.render('admin-view-all-prescriptions', {
                prescriptions: {
                    rows: allPrescriptions,
                    currentPage: page,
                    totalPages: totalPages
                }
            });
        } catch (err) {
            console.error('Error in /view-all-prescriptions: ', err);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(403).send('Permission Denied');
    }
});

router.post('/delete-prescription/:id', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            const prescriptionId = req.params.id;
            await Prescription.deletePrescription(prescriptionId);
            res.redirect('/admin/view-all-prescriptions');
        } catch (err) {
            console.error("Error in delete prescription route:", err);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(403).send('Permission Denied');
    }
});

module.exports = router;


router.post('/add-prescription', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            const { userId, medicineId, quantity } = req.body;
            await Prescription.addPrescription(userId, medicineId, quantity);
            res.redirect('/admin/add-prescription');
        } catch (err) {
            res.status(500).send('Server Error');
        }
    } else {
        res.status(403).send('Permission Denied');
    }
});

module.exports = router;
