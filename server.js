// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к БД
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// Создание таблицы пользователей
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  username TEXT UNIQUE,
  password TEXT
)`);

// Регистрация
app.post('/register', (req, res) => {
  const { first_name, last_name, email, age, username, password } = req.body;
  db.run(
    `INSERT INTO users (first_name, last_name, email, age, username, password)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, age, username, password],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          res.status(400).json({ error: 'Логин уже занят' });
        } else {
          res.status(500).json({ error: 'Ошибка сервера' });
        }
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Вход (логин) с возвратом данных пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT first_name, last_name, age, username FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Ошибка сервера' });
      if (row) res.json({ success: true, user: row });
      else res.status(401).json({ error: 'Неверный логин или пароль' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});