export interface IIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export interface IPastry {
  id: string;
  name: string;
  ingredients: IIngredient[];
}

export interface ISale {
  id: string;
  pastry: IPastry;
  price: number;
  amount: number;
  date: Date;
  discount?: number;
  available?: boolean;
}

export interface IUser {
  email: string;
  password: string;
}
