import React from 'react';
import { Ingredient } from '../../utils/data_utils/data_utils';
import IngredientItem from './IngredientItem';
import './IngredientList.css';

type Props = {
  ingredients: Ingredient[];
};

export default function IngredientList({ ingredients }: Props) {
  let html: JSX.Element[] = ingredients.map((ingredient, index) => {
    return <IngredientItem key={index} ingredient={ingredient} />;
  });

  if (ingredients.length === 0) {
    html.push(
      <div key={'empty_ingredient_list'} className="ingredient__list--empty">
        Non specificati
      </div>
    );
  }

  return (
    <div className="ingredientlist__container">
      <h1 className="ingredientlist__title">Ingredienti</h1>
      {html}
    </div>
  );
}
