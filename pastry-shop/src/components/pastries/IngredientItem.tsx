import React from 'react';

import { Ingredient } from '../../utils/data_utils/data_utils';
import './IngredientItem.css';

type Props = {
  ingredient: Ingredient;
};

function IngredientItem({ ingredient }: Props) {
  return (
    <div>
      <div className="ingredient__title">
        {ingredient.name}
        <div className="ingredient__amount">
          {ingredient.amount} {ingredient.unit}
        </div>
      </div>
    </div>
  );
}

export default IngredientItem;
