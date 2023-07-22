import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Ingredient, Sale } from '../utils/data_utils/data_utils';
import { generateString } from '../utils/data_utils/strings';
import Input from '../components/form_element/Input';
import {
  VALIDATOR_POSITIVE_NUMBER,
  VALIDATOR_REQUIRED,
} from '../utils/data_utils/validators';
import { useForm } from '../utils/custom_hooks/form-hook';
import './NewUpdatePage.css';
import InputIngredient from '../components/form_element/InputIngredient';
import Button from '../components/form_element/Button';
import React from 'react';
import { useHttpClient } from '../utils/custom_hooks/http-hook';
import { AuthContext } from '../utils/context/authentication-context';

type ObjectInfo = {
  saleId: string;
  pastryId: string;
  fetchedFromDB: boolean;
};

const backend_url =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function NewUpdatePage() {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  // Keeping infos about the fetched object (no form input data)
  const [objectInfo, setObjectInfo] = useState<ObjectInfo>({
    saleId: generateString(),
    pastryId: generateString(),
    fetchedFromDB: false,
  });

  // Each text field will be a key into inputs of formState variable
  const { formState, onInputChange, setData } = useForm({
    inputs: {
      name: {
        value: '',
        isValid: false,
      },
      amount: {
        value: '',
        isValid: false,
      },
      price: {
        value: '',
        isValid: false,
      },
    },
    formIsValid: false,
  });

  const navigate = useNavigate();

  //console.log('NewUpdatePage', formState);
  // Taking the saleId from the URL if any
  const saleId = useParams().saleId;

  // First time we need to get the sale data if saleId is provided
  useEffect(() => {
    const fetchSale = async () => {
      if (saleId) {
        try {
          const responseData = await sendRequest(
            `${backend_url}/api/sales/${saleId}`
          );
          let fetchedSale: Sale = responseData.sale;

          // Update formState with the data
          let formData = {
            inputs: {
              name: {
                value: fetchedSale.pastry.name,
                isValid: true,
              },
              amount: {
                value: fetchedSale.amount,
                isValid: true,
              },
              price: {
                value: fetchedSale.price,
                isValid: true,
              },
            },
            formIsValid: true,
          };

          // For each ingredient in the pastry object we need to add its informations into the formState
          fetchedSale.pastry.ingredients.forEach((ingredient: Ingredient) => {
            formData.inputs = {
              ...formData.inputs,
              ['ingredient_' + ingredient.id + '_name']: {
                value: ingredient.name,
                isValid: true,
              },
              ['ingredient_' + ingredient.id + '_amount']: {
                value: ingredient.amount,
                isValid: true,
              },
              ['ingredient_' + ingredient.id + '_unit']: {
                value: ingredient.unit,
                isValid: true,
              },
            };
          });

          setData(formData);
          setObjectInfo({
            saleId: fetchedSale.id,
            pastryId: fetchedSale.pastry.id,
            fetchedFromDB: true,
          });
        } catch (err) {}
      }
    };

    fetchSale();
  }, [saleId, setData, sendRequest]);

  const onIngredientInputsChangeHandler = useCallback(
    (value: Ingredient, isValid: boolean): void => {
      // Update formState with the data of the ingredient
      onInputChange('ingredient_' + value.id + '_name', value.name, isValid);
      onInputChange(
        'ingredient_' + value.id + '_amount',
        value.amount,
        isValid
      );
      onInputChange('ingredient_' + value.id + '_unit', value.unit, isValid);
    },
    [onInputChange]
  );

  const onIngredientInputsDeleteHandler = useCallback(
    (id: string): void => {
      delete formState.inputs['ingredient_' + id + '_name'];
      delete formState.inputs['ingredient_' + id + '_amount'];
      delete formState.inputs['ingredient_' + id + '_unit'];

      setData(formState);
    },
    [formState, setData]
  );

  const addIngredientHandler = () => {
    const random = generateString();

    // Update formState with the data of an empty ingredient
    onInputChange('ingredient_' + random + '_name', '', false);
    onInputChange('ingredient_' + random + '_amount', '', false);
    onInputChange('ingredient_' + random + '_unit', '', false);
  };

  const saveDataHandler = async () => {
    if (!formState.formIsValid) {
      alert('Guarda che manca roba.');
      return;
    }

    let ingredients: Ingredient[] = [];
    Object.keys(formState.inputs).forEach((key: string) => {
      if (key.startsWith('ingredient_') && key.endsWith('_name')) {
        const prefix = key.substring(0, key.lastIndexOf('_'));
        const id = prefix.substring(prefix.indexOf('_') + 1);

        const ingredient: Ingredient = {
          id,
          name: formState.inputs[prefix + '_name'].value,
          amount: formState.inputs[prefix + '_amount'].value,
          unit: formState.inputs[prefix + '_unit'].value,
        };

        ingredients.push(ingredient);
      }
    });

    const data: Sale = {
      id: (objectInfo.fetchedFromDB && objectInfo.saleId) || '',
      pastry: {
        id: (objectInfo.fetchedFromDB && objectInfo.pastryId) || '',
        name: formState.inputs.name.value,
        ingredients: ingredients,
      },
      amount: formState.inputs.amount.value,
      price: formState.inputs.price.value,
      date: new Date(),
    };

    if (objectInfo.fetchedFromDB) {
      try {
        await sendRequest(
          `${backend_url}/api/sales/${
            objectInfo.fetchedFromDB && objectInfo.saleId
          }`,
          'PATCH',
          JSON.stringify(data),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          }
        );
        navigate('/sales');
      } catch (err) {
        alert('errore update');
        console.log(err);
      }
    } else {
      try {
        await sendRequest(
          `${backend_url}/api/sales`,
          'POST',
          JSON.stringify(data),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          }
        );
        navigate('/sales');
      } catch (err) {
        alert('errore salvataggio');
        console.log(err);
      }
    }
  };

  // Time to create the JSX content
  let content = null;
  //if (saleId && !objectInfo.fetchedFromDB) {
  if (isLoading) {
    content = <h1>Loading...</h1>;
  } else {
    let title = 'Crea vendita';
    if (saleId) {
      title = 'Modifica vendita';
    }

    content = (
      <React.Fragment>
        <div className="newupdate__title">
          <h3>{title}</h3>
        </div>
        <div className="newupdate__container">
          <Input
            id="name"
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED]}
            label={'Nome del dolce'}
            initialValue={formState.inputs.name?.value || ''}
            initialIsValid={!!formState.inputs.name?.isValid}
          />

          <Input
            id="amount"
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED, VALIDATOR_POSITIVE_NUMBER]}
            valueType="number"
            label={'Quantità del dolce'}
            initialValue={formState.inputs.amount?.value || ''}
            initialIsValid={!!formState.inputs.amount?.isValid}
          />

          <Input
            id="price"
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED, VALIDATOR_POSITIVE_NUMBER]}
            valueType="number"
            label={'Prezzo del dolce'}
            initialValue={formState.inputs.price?.value || ''}
            initialIsValid={!!formState.inputs.price?.isValid}
          />

          <div className="newupdate__ingredients">
            <div className="newupdate__ingredients--header">
              <h3>Ingredienti</h3>
              <div className="newupdate__ingredients--commands">
                <Button onClick={addIngredientHandler} size="small">
                  Nuovo ingrediente
                </Button>
              </div>
            </div>
            {
              // Each ingredient has 3 informations in the formState stored with keys starting with the same prefix
              Object.keys(formState.inputs)
                .filter(
                  (k) => k.startsWith('ingredient_') && k.endsWith('_name')
                )
                .map((input_key) => {
                  const prefix = input_key.substring(
                    0,
                    input_key.lastIndexOf('_')
                  );
                  const id = prefix.substring(prefix.indexOf('_') + 1);
                  return (
                    <InputIngredient
                      key={prefix}
                      id={id}
                      name={formState.inputs[prefix + '_name'].value}
                      amount={formState.inputs[prefix + '_amount'].value}
                      unit={formState.inputs[prefix + '_unit'].value}
                      onIngredientChange={onIngredientInputsChangeHandler}
                      onIngredientDelete={onIngredientInputsDeleteHandler}
                    />
                  );
                })
            }
          </div>

          <Button onClick={saveDataHandler} disabled={!formState.formIsValid}>
            Metti in vendita
          </Button>
        </div>
      </React.Fragment>
    );
  }

  return <div>{content}</div>;
}

export default NewUpdatePage;
