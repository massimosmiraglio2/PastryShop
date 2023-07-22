import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../models/http-error';
import Sale from '../models/sale';
import Pastry from '../models/pastry';
import { ISale, IPastry, IIngredient } from '../models/data-types';
import { generateString } from '../utils/strings';

const getSales: RequestHandler = async (req, res, next) => {
  let sales = [];
  try {
    sales = await Sale.find({}).populate('pastry');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find sales.',
      500
    );
    return next(error);
  }

  res.status(200).json({
    sales,
  });
};

const getSaleById: RequestHandler = async (req, res, next) => {
  const id = req.params.saleId;
  let sale: any = null;
  try {
    sale = await Sale.findById(id).populate('pastry');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a sale.',
      500
    );
    return next(error);
  }

  if (!sale) {
    return next(new HttpError('Sale not found', 404));
  }

  res.status(200).json({ sale });
};

const createSale: RequestHandler = async (req, res, next) => {
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

  const { pastry, amount, price } = req.body;
  const { name, ingredients } = pastry;

  const createdPastry = new Pastry({
    name,
    ingredients: ingredients.map((ing: IIngredient) => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    })),
  });

  const createdSale = new Sale({
    pastry: createdPastry.id,
    price,
    amount,
    date: new Date(),
  });

  try {
    await createdPastry.save();
    await createdSale.save();
  } catch (err) {
    const error = new HttpError('Creating sale failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ sale: createdSale });
};

const updateSale: RequestHandler = async (req, res, next) => {
  const id = req.params.saleId;
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

  const { pastry, amount, price } = req.body;
  const { name } = pastry;
  let ingredients = pastry.ingredients.map((ing: IIngredient) => {
    return { name: ing.name, amount: ing.amount, unit: ing.unit };
  });

  try {
    //TODO begin transaction...
    let sale = await Sale.findById(id).populate('pastry');
    if (!sale) {
      return next(new HttpError('Sale not found', 404));
    }

    const pastryId = sale.pastry.id;
    let pastryOld = await Pastry.findById(pastryId);
    if (!pastryOld) {
      console.log('>>SALE<< ', sale);
      return next(new HttpError('Pastry not found', 404));
    }

    pastryOld.name = name;
    pastryOld.ingredients = ingredients;
    sale.price = price;
    sale.amount = amount;

    await pastryOld.save();
    await sale.save();
    //end transaction

    return res.status(201).json({ sale });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Updating sale failed, please try again.', 500);
    return next(error);
  }
};

const deleteSale: RequestHandler = async (req, res, next) => {
  const id = req.params.saleId;
  let sale: any = null;
  try {
    //TODO begin transaction...
    sale = await Sale.findById(id).populate('pastry');
    if (!sale) {
      return next(new HttpError('Sale not found', 404));
    }

    const pastryId = sale.pastry.id;
    await Sale.findByIdAndDelete(id);
    await Pastry.findByIdAndDelete(pastryId);

    return res.status(200).json({ sale });
    //end transaction
  } catch (err) {
    const error = new HttpError('Deleting sale failed, please try again.', 500);
    return next(error);
  }
};

export default {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
  updateSale,
};
