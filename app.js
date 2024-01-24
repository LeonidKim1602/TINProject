const express = require('express');
const path = require('path');
const session = require('express-session');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const adminRoutes = require('./routes/admin');
const prescriptionsRouter = require('./routes/prescriptions');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.engine('pug', require('pug').__express)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admin', adminRoutes);
app.use('/prescriptions', prescriptionsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
