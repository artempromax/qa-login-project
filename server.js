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
    poster: "https://www.kinopoisk.ru/picture/2808223/",
    link: "https://www.kinopoisk.vip/film/326/"
  },
  {
    title: "Крёстный отец",
    year: 1972,
    rating: 9.2,
    poster: "https://www.kinopoisk.ru/picture/3776147/",
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
  },
  {
    title: "Форрест Гамп",
    year: 1994,
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    link: "https://www.kinopoisk.vip/film/448/"
  },
  {
    title: "Матрица",
    year: 1999,
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    link: "https://www.kinopoisk.vip/film/301/"
  },
  {
    title: "Гладиатор",
    year: 2000,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    link: "https://www.kinopoisk.vip/film/474/"
  },
  {
    title: "Зелёная миля",
    year: 1999,
    rating: 8.9,
    poster: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    link: "https://www.kinopoisk.vip/film/435/"
  },
  {
    title: "1+1",
    year: 2011,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/323BP0itpxTsO0skTwdnVmf7YC9.jpg",
    link: "https://www.kinopoisk.vip/film/535341/"
  },
  {
    title: "Остров проклятых",
    year: 2010,
    rating: 8.2,
    poster: "https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
    link: "https://www.kinopoisk.vip/film/397667/"
  },
  {
    title: "Джанго освобождённый",
    year: 2012,
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    link: "https://www.kinopoisk.vip/film/586397/"
  },
  {
    title: "Паразиты",
    year: 2019,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    link: "https://www.kinopoisk.vip/film/1043758/"
  },
  {
    title: "Волк с Уолл-стрит",
    year: 2013,
    rating: 8.2,
    poster: "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    link: "https://www.kinopoisk.vip/film/462682/"
  },
  {
    title: "Одержимость",
    year: 2014,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    link: "https://www.kinopoisk.vip/film/725190/"
  },
  {
    title: "Семь",
    year: 1995,
    rating: 8.6,
    poster: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    link: "https://www.kinopoisk.vip/film/377/"
  },
  {
    title: "Престиж",
    year: 2006,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg",
    link: "https://www.kinopoisk.vip/film/195334/"
  },
  {
    title: "Помни",
    year: 2000,
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg",
    link: "https://www.kinopoisk.vip/film/335/"
  },
  {
    title: "Леон",
    year: 1994,
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg",
    link: "https://www.kinopoisk.vip/film/389/"
  },
  {
    title: "Терминатор 2",
    year: 1991,
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
    link: "https://www.kinopoisk.vip/film/444/"
  },
  {
    title: "Назад в будущее",
    year: 1985,
    rating: 8.6,
    poster: "https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
    link: "https://www.kinopoisk.vip/film/476/"
  },
  {
    title: "ВАЛЛ-И",
    year: 2008,
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    link: "https://www.kinopoisk.vip/film/279102/"
  },
  {
  title: "Брат",
  year: 1997,
  rating: 8.3,
  poster: "https://image.tmdb.org/t/p/w500/6csgJ9L0K7wN8Iky3Uczdlz7YT1.jpg",
  link: "https://www.kinopoisk.vip/film/41519/"
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
