import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { IPastry } from './data-types';

const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  {
    virtuals: {
      id: {
        get() {
          return this._id.toHexString();
        },
      },
    },
  }
);

ingredientSchema.set('toObject', { virtuals: true });
ingredientSchema.set('toJSON', { virtuals: true });
ingredientSchema.plugin(uniqueValidator);

const pastrySchema = new Schema(
  {
    name: { type: String, required: true },
    ingredients: [{ type: ingredientSchema, required: true }],
  },
  {
    virtuals: {
      id: {
        get() {
          return this._id.toHexString();
        },
      },
    },
  }
);

pastrySchema.set('toObject', { virtuals: true });
pastrySchema.set('toJSON', { virtuals: true });
pastrySchema.plugin(uniqueValidator);

export default mongoose.model<IPastry>('Pastry', pastrySchema);
