import mongoose, { Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { ISale } from './data-types';

const Schema = mongoose.Schema;

const saleSchema = new Schema(
  {
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    pastry: { type: mongoose.Types.ObjectId, required: true, ref: 'Pastry' },
  },
  {
    virtuals: {
      id: {
        get() {
          return this._id.toHexString();
        },
      },

      discount: {
        get() {
          const currdate = new Date();

          const differenceInTime =
            currdate.getTime() - new Date(this.date).getTime();
          const differenceInDays = differenceInTime / (1000 * 3600 * 24);

          let discount = 0;
          if (differenceInDays >= 1 && differenceInDays < 2) {
            discount = 0.2;
          } else if (differenceInDays >= 2) {
            discount = 0.8;
          }

          return discount;
        },
      },

      available: {
        get() {
          const currdate = new Date();

          const differenceInTime =
            currdate.getTime() - new Date(this.date).getTime();
          const differenceInDays = differenceInTime / (1000 * 3600 * 24);

          return differenceInDays < 3;
        },
      },
    },
  }
);

saleSchema.set('toObject', { virtuals: true });
saleSchema.set('toJSON', { virtuals: true });

saleSchema.plugin(uniqueValidator);

export default mongoose.model<ISale>('Sale', saleSchema);
