const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT  -- New column for category
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      medicineId INTEGER NOT NULL,
      quantity INTEGER,  -- New column for quantity
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(medicineId) REFERENCES medicines(id)
    )
  `);


  db.run("BEGIN TRANSACTION;");

  const users = [
    { username: 'user1', password: 'password1', role: 'user' },
    { username: 'user2', password: 'password2', role: 'user' },
    { username: 'admin', password: 'adminpassword', role: 'admin' }
  ];

  users.forEach(user => {
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [user.username, user.password, user.role]);
  });

  const medicines = [
    { name: 'Amoxicillin', category: 'Antibiotic' },
    { name: 'Ibuprofen', category: 'Analgesic' }
  ];

  medicines.forEach(medicine => {
    db.run("INSERT INTO medicines (name, category) VALUES (?, ?)", [medicine.name, medicine.category]);
  });

  db.run("END;");

  const stmt = db.prepare("INSERT INTO prescriptions (userId, medicineId, quantity) VALUES (?, ?, ?)");

  for (let i = 1; i <= 50; i++) {
    let userId = (i % users.length) + 1; 
    let medicineId = (i % medicines.length) + 1; 
    let quantity = Math.floor(Math.random() * 100) + 1; 

    stmt.run(userId, medicineId, quantity);
  }

  stmt.finalize();

  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database seeded with a large number of prescriptions.');
    }
  });
});