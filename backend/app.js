const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = 'supersecretkey';

app.use(express.json());
app.use(cors());

// 🔗 Σύνδεση με MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_app'
});

db.connect(err => {
  if (err) {
    console.error('❌ Σφάλμα σύνδεσης στη βάση:', err);
  } else {
    console.log('✅ Συνδεθήκαμε με MySQL');
  }
});

// 🔐 Middleware για token
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Απαιτείται token' });

  const token = auth.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Μη έγκυρο token' });
    req.user = decoded;
    next();
  });
};

// 🔐 Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Όνομα, email και κωδικός απαιτούνται' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Σφάλμα διακομιστή' });
    if (results.length > 0) return res.status(400).json({ error: 'Ο χρήστης υπάρχει ήδη' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err2, result) => { 
        if (err2) return res.status(500).json({ error: 'Σφάλμα κατά την εγγραφή' });

        const token = jwt.sign({ id: result.insertId }, SECRET, { expiresIn: '1h' });
        res.json({ token });
      }
    );
  });
});


// 🔐 Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Σφάλμα διακομιστή' });
    if (results.length === 0) return res.status(401).json({ error: 'Λανθασμένα στοιχεία' });

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Λανθασμένος κωδικός' });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Σύνδεση επιτυχής', token });
  });
});

// 📦 GET εστιατόρια
app.get('/restaurants', authenticate, (req, res) => {
  db.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      console.error('Σφάλμα κατά την ανάκτηση εστιατορίων:', err);
      return res.status(500).json({ error: 'Σφάλμα στον server' });
    }
    res.json(results);
  });
});

// ➕ POST νέο εστιατόριο (προαιρετικό)
app.post('/restaurants', authenticate, (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'Όνομα και τοποθεσία απαιτούνται' });

  db.query('INSERT INTO restaurants (name, location) VALUES (?, ?)', [name, location], (err, result) => {
    if (err) {
      console.error('Σφάλμα κατά την προσθήκη εστιατορίου:', err);
      return res.status(500).json({ error: 'Σφάλμα κατά την προσθήκη' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// 📅 POST κράτηση
app.post('/reservations', authenticate, (req, res) => {
  const { restaurant_id, date, time, people } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO reservations (user_id, restaurant_id, date, time, people)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, restaurant_id, date, time, people], (err, result) => {
    if (err) {
      console.error('❌ Σφάλμα στην κράτηση:', err);
      return res.status(500).json({ error: 'Σφάλμα κατά την αποθήκευση' });
    }

    res.json({ success: true, reservationId: result.insertId });
  });
});


app.post('/reservations', authenticate, (req, res) => {
  const { restaurant_id, date, time, people } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO reservations (user_id, restaurant_id, date, time, people)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, restaurant_id, date, time, people], (err, result) => {
    if (err) {
      console.error('❌ Σφάλμα στην κράτηση:', err);
      return res.status(500).json({ error: 'Σφάλμα κατά την αποθήκευση' });
    }

    res.json({ success: true, reservationId: result.insertId });
  });
});

// 📋 GET όλες οι κρατήσεις του χρήστη
app.get('/reservations', authenticate, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT reservations.*, restaurants.name AS restaurant_name, restaurants.location
    FROM reservations
    JOIN restaurants ON reservations.restaurant_id = restaurants.id
    WHERE reservations.user_id = ?
    ORDER BY date DESC, time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Σφάλμα στην ανάκτηση κρατήσεων:', err);
      return res.status(500).json({ error: 'Σφάλμα κατά την ανάκτηση κρατήσεων' });
    }

    res.json(results);
  });
});


app.put('/update-reservation/:id', authenticate, (req, res) => {
  const { time, people } = req.body;
  const userId = req.user.id;
  const reservationId = req.params.id;

  db.query(
    `UPDATE reservations
     SET time = ?, people = ?
     WHERE id = ? AND user_id = ?`,
    [time, people, reservationId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Σφάλμα ενημέρωσης' });
      res.json({ success: true });
    }
  );
});

app.delete('/delete-reservation/:id', authenticate, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id;

  db.query(
    'DELETE FROM reservations WHERE id = ? AND user_id = ?',
    [reservationId, userId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Σφάλμα διαγραφής' });
      res.json({ success: true });
    }
  );
});

// 📥 Λήψη κρατήσεων χρήστη
app.get('/my-reservations', authenticate, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT r.id, r.date, r.time, r.people, res.name AS restaurant_name
    FROM reservations r
    JOIN restaurants res ON r.restaurant_id = res.id
    WHERE r.user_id = ?
    ORDER BY r.date DESC, r.time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Σφάλμα ανάκτησης κρατήσεων:', err);
      return res.status(500).json({ error: 'Σφάλμα στον server' });
    }

    res.json(results);
  });
});


// ▶️ Εκκίνηση server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
