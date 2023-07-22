import express from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middleware/check-authentication';
import salesController from '../controllers/pastries-controllers';

const router = express.Router();

router.get('/', salesController.getSales);
router.get('/:saleId', salesController.getSaleById);

// middleware for authentication (next routes are admin only)
router.use(authMiddleware);

router.post(
  '/',
  [
    check('price', 'Price is required').not().isEmpty().isNumeric(),
    check('amount', 'Amount is required').not().isEmpty().isNumeric(),
    check('pastry.name', 'Pastry name is required').not().isEmpty(),
    check('pastry.ingredients', 'Pastry ingredients not correct')
      .not()
      .isEmpty()
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }

        let problemFound = false;
        value.forEach((ingredient) => {
          if (!ingredient.name || !ingredient.amount || !ingredient.unit) {
            problemFound = true;
          }
        });

        return !problemFound;
      }),
  ],
  salesController.createSale
);

router.patch(
  '/:saleId',
  [
    check('price', 'Price is required').not().isEmpty().isNumeric(),
    check('amount', 'Amount is required').not().isEmpty().isNumeric(),
    check('pastry.name', 'Pastry name is required').not().isEmpty(),
    check('pastry.ingredients', 'Pastry ingredients not correct')
      .not()
      .isEmpty()
      .custom((value) => {
        if (!Array.isArray(value)) {
          return false;
        }

        let problemFound = false;
        value.forEach((ingredient) => {
          if (!ingredient.name || !ingredient.amount || !ingredient.unit) {
            problemFound = true;
          }
        });

        return !problemFound;
      }),
  ],
  salesController.updateSale
);

router.delete('/:saleId', salesController.deleteSale);

export default router;
