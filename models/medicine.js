const db = require('../db');

class Medicine {
  static getAllMedicines() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM medicines', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static addMedicine(name, category) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO medicines (name, category) VALUES (?, ?)';
      db.run(sql, [name, category], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  }

  static updateMedicine(id, name, category) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE medicines SET name = ?, category = ? WHERE id = ?';
      db.run(sql, [name, category, id], (err) => {
        if (err) reject(err);
        resolve('Medicine updated successfully');
      });
    });
  }
  

  static findMedicineById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM medicines WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static deleteMedicine(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM medicines WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) reject(err);
        resolve('Medicine deleted successfully');
      });
    });
  }
  

  static updateMedicineCategory(id, category) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE medicines SET category = ? WHERE id = ?';
      db.run(sql, [category, id], (err) => {
        if (err) reject(err);
        resolve('Medicine category updated successfully');
      });
    });
  }

}

module.exports = Medicine;
