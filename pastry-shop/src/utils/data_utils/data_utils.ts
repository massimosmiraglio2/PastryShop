export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
};

export type Pastry = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

export type Sale = {
  id: string;
  pastry: Pastry;
  price: number;
  amount: number;
  date: Date;
  discount?: number;
  available?: boolean;
};

