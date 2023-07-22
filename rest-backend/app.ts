import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import pastriesRoutes from './routes/pastries-router';
import usersRoutes from './routes/users-router';
import HttpError from './models/http-error';
import devInit from './utils/dev-initialization';

const app = express();

app.use(bodyParser.json());

// resolving CORS issues and setting headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// routes
app.use('/api/users', usersRoutes);
app.use('/api/sales', pastriesRoutes);

// routes not found handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// middleware to handle errors occurring in the routes
app.use(
  (
    error: TypeError | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      return next(error);
    }

    if (!(error instanceof HttpError)) {
      error = new HttpError('Unknown error occurred');
    }

    res.status((error as HttpError).code || 500);
    res.json({ message: error.message || 'Generic error' });
  }
);

// DB parameters
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 27017;
const db_name = process.env.DB_NAME || 'pastryshop';

// Server parameters
const api_server_port = process.env.API_SERVER_PORT || 5000;

mongoose
  .connect(
    `mongodb://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=training-db&authMechanism=SCRAM-SHA-256`
  )
  .then(() => {
    // launch init function to initialize dummy data the first time
    devInit.initDB();
    // server start
    app.listen(api_server_port);
  })
  .catch((error) => {
    console.log(error);
  });
