import createError, { HttpError } from 'http-errors';
import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { config } from 'dotenv';
import { connectMongoDB } from './utils';
import cors from 'cors';
import { devLog } from './utils';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';

config();
connectMongoDB("todomatic");

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response): void {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});
devLog('server running on http://localhost:' + process.env.PORT);

module.exports = app;
