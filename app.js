/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('dotenv').config();
// ===== MODULES ===============================================================
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import path from 'path';
import SocketServer from 'socket.io';
import {Server} from 'http';

// ===== ROUTES ================================================================
import index from './routes/index';

// ===== SOCKETS ===============================================================
//import attachSockets from './sockets';

/* =============================================
   =                Initialize                 =
   ============================================= */

export const app = express();
const appPort = process.env.PORT;

/* =============================================
   =           Basic Configuration             =
   ============================================= */

/* ----------  Views  ---------- */

app.set('view engine', 'ejs');

/* ----------  Static Assets  ---------- */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // eslint-disable-line
app.use(express.static(path.join(__dirname, 'public'))); // eslint-disable-line

/* ----------  Parsers  ---------- */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/* ----------  Loggers &c  ---------- */

app.use(logger('dev'));

/* =============================================
   =                   Sockets                 =
   ============================================= */

/* ----------  Sockets  ---------- */

// Sockets
export const server = Server(app);
const io = new SocketServer(server, {pingInterval: 2000, pingTimeout: 5000});

//attachSockets(io);

/* ----------  Sockets Hooks  ---------- */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(function(req, res, next) {
  res.io = io;
  next();
});

/* =============================================
   =                   Routes                  =
   ============================================= */

/* ----------  Primary / Happy Path  ---------- */
app.use('/', index);

/* ----------  Errors  ---------- */
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    new Error(err); // eslint-disable-line no-new
  });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

/* =============================================
   =            Complete Configuration         =
   ============================================= */
server.listen(appPort);

export default app;
