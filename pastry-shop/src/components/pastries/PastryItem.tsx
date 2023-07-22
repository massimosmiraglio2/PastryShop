import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Sale } from '../../utils/data_utils/data_utils';
import './PastryItem.css';
import IngredientList from './IngredientList';
import Price from './Price';
import Button from '../form_element/Button';
import Modal from '../ui_element/Modal';

type Props = {
  sale: Sale;
  onDelete?: (saleId: string) => void;
};

function PastryItem({ sale, onDelete }: Props) {
  const { pathname } = useLocation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const deleteHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  //console.log(sale);

  return (
    <React.Fragment>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header={'Confermare eliminazione'}
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button
              inverse
              onClick={cancelDeleteHandler}
              className="navbar__btn--margin"
            >
              ANNULLA
            </Button>
            <Button
              onClick={() => onDelete && onDelete(sale.id)}
              className="navbar__btn--margin"
            >
              ELIMINA
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Sei sicuro di voler eliminare questo elemento?
          <br />
          Quest'azione non può essere annullata.
        </p>
      </Modal>

      <div
        className={
          'pastryitem__container' +
          (!sale.available ? ' pastryitem__container--notavailable' : '')
        }
      >
        <div className="pastryitem__title">
          <h3>{sale.pastry.name}</h3>
          <span className="pastryitem__amount">x{sale.amount}</span>{' '}
          {!sale.available ? (
            <div className="pastryitem__expired">SCADUTO</div>
          ) : null}
        </div>
        <div className="pastryitem__content">
          <IngredientList ingredients={sale.pastry.ingredients} />
        </div>
        <div className="pastryitem__footer">
          {pathname === '/sales' ? (
            <span>
              <Button
                className="pastryitem__button"
                size="small"
                inverse
                to={'/sales/' + sale.id}
              >
                MODIFICA
              </Button>

              <Button
                className="pastryitem__button"
                size="small"
                inverse
                onClick={deleteHandler}
              >
                ELIMINA
              </Button>
            </span>
          ) : null}
          <Price price={sale.price} discount={sale.discount} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default PastryItem;
