const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const secret = require('./src/config/sessionConfig');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: secret.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:  30 * 24 * 60 * 60 * 1000,
    secure: false
  }
}));

app.use('/', require('./src/routes/pages'));
app.use('/api', require('./src/routes/api'));

app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});


