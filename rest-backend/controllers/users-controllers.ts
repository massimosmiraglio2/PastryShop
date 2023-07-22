import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

import HttpError from '../models/http-error';
import User from '../models/user';

const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req)
    .formatWith((error) => error.msg)
    .array();
  if (errors.length) {
    return next(
      new HttpError(
        'Invalid inputs passed, please check your data. ' + errors.join(', '),
        422
      )
    );
  }

  const { email, password } = req.body;

  try {
    let users = await User.find({ email });
    if (!users || users.length !== 1) {
      const error = new HttpError('Invalid credentials.', 403);
      return next(error);
    }

    const user = users[0];
    const hashedPassword = user.password;

    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      const error = new HttpError('Invalid credentials.', 403);
      return next(error);
    }

    let secret: Secret =
      process.env.TOKEN_PRIVATE_KEY || 'alternative_private_key';

    let token = jwt.sign({ userId: user.id }, secret);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, impossible to login.',
      500
    );
    return next(error);
  }
};

export default {
  login,
};
