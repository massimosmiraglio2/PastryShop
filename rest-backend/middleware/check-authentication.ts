import { RequestHandler, Request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import HttpError from '../models/http-error';

const authMiddleware: RequestHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  console.log('authMiddleware');
  try {
    const token = req.headers?.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    console.log(req.headers.authorization);
    if (!token) {
      throw new Error('No authentication token');
    }

    let secret: Secret =
      process.env.TOKEN_PRIVATE_KEY || 'alternative_private_key';

    const decodedToken = jwt.verify(token, secret); // throws error if fails
    const { userId } = <{ userId: string }>decodedToken;
    //req.userId = userId;

    next();
  } catch (err) {
    const error = new HttpError('Authentication failed', 401);
    return next(error);
  }
};

export default authMiddleware;
