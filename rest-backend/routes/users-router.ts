import express from 'express';
import { check } from 'express-validator';

import userController from '../controllers/users-controllers';

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Email is required').not().isEmpty().isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  userController.login
);

export default router;
