import mongoose, { Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { IUser } from './data-types';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
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

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('User', userSchema);
