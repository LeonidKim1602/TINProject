const db = require('../db');

class Prescription {

  static getAllPrescriptionsWithDetails() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT users.username,
                   medicines.name AS medicine_name,
                   prescriptions.quantity,
                   medicines.category AS medicine_category
            FROM prescriptions
            JOIN users ON prescriptions.userId = users.id
            JOIN medicines ON prescriptions.medicineId = medicines.id
        `;
        db.all(sql, (err, prescriptions) => {
            if (err) reject(err);
            resolve(prescriptions);
        });
    });
}

static getPrescriptionsWithDetailsPaginated(limit, offset) {
    return new Promise((resolve, reject) => {
    const sql = `
        SELECT prescriptions.id AS prescription_id,
               users.username,
               medicines.name AS medicine_name,
               prescriptions.quantity,
               medicines.category AS medicine_category
        FROM prescriptions
        JOIN users ON prescriptions.userId = users.id
        JOIN medicines ON prescriptions.medicineId = medicines.id
        LIMIT ? OFFSET ?
    `;
    db.all(sql, [limit, offset], (err, prescriptions) => {
        if (err) {
            reject(err);
        } else {
            resolve(prescriptions);
        }
    });
    });
}


  static addPrescription(userId, medicineId, quantity) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO prescriptions (userId, medicineId, quantity) VALUES (?, ?, ?)';
      db.run(sql, [userId, medicineId, quantity], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT prescriptions.id, medicines.name AS medicine_name, medicines.category, prescriptions.quantity
        FROM prescriptions
        JOIN medicines ON prescriptions.medicineId = medicines.id
        WHERE prescriptions.userId = ?`;
      db.all(sql, [userId], (err, prescriptions) => {
        if (err) reject(err);
        resolve(prescriptions);
      });
    });
  }

  static deletePrescription(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM prescriptions WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`Prescription with id ${id} deleted successfully`);
        }
      });
    });
  }

  static countPrescriptions() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS total FROM prescriptions';
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.total);
            }
        });
    });
}
}



module.exports = Prescription;
