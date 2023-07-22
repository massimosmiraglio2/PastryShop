import bcrypt from 'bcryptjs';

import User from '../models/user';
import Pastry from '../models/pastry';
import Sale from '../models/sale';
import { IUser } from '../models/data-types';

// This function create initial values on the DB (users and some example sale)
const initDB = async () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const oneDayBeforeYesterday = new Date();
  oneDayBeforeYesterday.setDate(yesterday.getDate() - 1);
  const twoDayBeforeYesterday = new Date();
  twoDayBeforeYesterday.setDate(yesterday.getDate() - 2);

  try {
    const user_exists: IUser | null = await User.findOne({});
    if (user_exists) {
      return; // at least one user exists: no init procedure needed
    }

    let documents: any[] = [];

    // create user for Luana
    documents[documents.length] = new User({
      email: 'luana@pastryshop.it',
      password: await bcrypt.hash('Luanapsw', 12),
    });

    // create user for Maria
    documents[documents.length] = new User({
      email: 'maria@pastryshop.it',
      password: await bcrypt.hash('Mariapsw', 12),
    });

    // create pastry for tiramisù
    documents[documents.length] = new Pastry({
      name: 'Tiramisù',
      ingredients: [
        { name: 'Savoiardi', amount: 500, unit: 'g' },
        { name: 'Mascarpone', amount: 250, unit: 'g' },
        { name: 'Uova', amount: 4, unit: '-' },
        { name: 'Caffè', amount: 1, unit: 'tazza' },
      ],
    });

    // create sale for tiramisù
    documents[documents.length] = new Sale({
      pastry: documents[documents.length - 1].id,
      amount: 15,
      price: 25,
      date: today,
    });

    // create pastry for cheescake
    documents[documents.length] = new Pastry({
      name: 'Cheescake',
      ingredients: [
        { name: 'Formaggio', amount: 500, unit: 'g' },
        { name: 'Panna', amount: 200, unit: 'g' },
        { name: 'Zucchero', amount: 200, unit: 'g' },
        { name: 'Biscotti', amount: 250, unit: 'g' },
        { name: 'Burro ', amount: 150, unit: 'g' },
      ],
    });

    // create sale for cheescake
    documents[documents.length] = new Sale({
      pastry: documents[documents.length - 1].id,
      amount: 10,
      price: 25,
      date: yesterday,
    });

    // create pastry for ciambellone
    documents[documents.length] = new Pastry({
      name: 'Ciambellone',
      ingredients: [
        { name: 'Farina', amount: 350, unit: 'g' },
        { name: 'Yogurt', amount: 1, unit: 'vasetto' },
        { name: 'Zucchero', amount: 200, unit: 'g' },
        { name: 'Uova', amount: 4, unit: '-' },
      ],
    });

    // create sale for ciambellone
    documents[documents.length] = new Sale({
      pastry: documents[documents.length - 1].id,
      amount: 5,
      price: 10,
      date: oneDayBeforeYesterday,
    });

    // create pastry for red velvet
    documents[documents.length] = new Pastry({
      name: 'Red Velvet',
      ingredients: [
        { name: 'Farina', amount: 300, unit: 'g' },
        { name: 'Latte', amount: 100, unit: 'ml' },
        { name: 'Zucchero', amount: 200, unit: 'g' },
        { name: 'Cacao', amount: 100, unit: 'g' },
        { name: 'Uova', amount: 4, unit: '-' },
        { name: 'Panna', amount: 100, unit: 'g' },
        { name: 'Amarene', amount: 150, unit: 'g' },
      ],
    });

    // create sale for red velvet
    documents[documents.length] = new Sale({
      pastry: documents[documents.length - 1].id,
      amount: 3,
      price: 30,
      date: twoDayBeforeYesterday,
    });

    // saving all the documents on the DB
    documents.forEach(async (document) => {
      await document.save();
    });
  } catch (err) {
    console.log('Error in initDB');
  }
};

export default {
  initDB,
};
