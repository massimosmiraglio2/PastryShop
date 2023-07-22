import React from 'react';

import './Price.css';

type Props = {
  price: number;
  discount?: number;
};

function Price({ price, discount }: Props) {

  return (
    <div className="price__container">
      <p className={discount ? 'price__pricenumber--strike' : ''}>
        {price} €
      </p>
      {discount ? (
        <p>{Math.round(price * (1 - discount) * 100) / 100} €</p>
      ) : null}
    </div>
  );
}

export default Price;
