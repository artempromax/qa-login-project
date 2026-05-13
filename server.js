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

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  username TEXT UNIQUE,
  password TEXT
)`);

// 🎬 ТОП фильмы (упрощённый список)
const movies = [
  {
    title: "Побег из Шоушенка",
    year: 1994,
    rating: 9.3,
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    link: "https://www.kinopoisk.vip/film/326/"
  },
  {
    title: "Крёстный отец",
    year: 1972,
    rating: 9.2,
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    link: "https://www.kinopoisk.vip/film/325/"
  },
  {
    title: "Тёмный рыцарь",
    year: 2008,
    rating: 9.0,
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    link: "https://www.kinopoisk.vip/film/111543/"
  },
  {
    title: "Бойцовский клуб",
    year: 1999,
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    link: "https://www.kinopoisk.vip/film/361/"
  },
  {
    title: "Начало",
    year: 2010,
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    link: "https://www.kinopoisk.vip/film/447301/"
  },
  {
    title: "Интерстеллар",
    year: 2014,
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    link: "https://www.kinopoisk.vip/film/258687/"
  }
];

// API фильмов
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

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

// Логин
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
