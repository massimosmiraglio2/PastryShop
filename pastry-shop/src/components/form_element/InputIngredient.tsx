import React, { useEffect } from 'react';

//import './InputIngredient.css';
import {
  VALIDATOR_REQUIRED,
  VALIDATOR_POSITIVE_NUMBER,
} from '../../utils/data_utils/validators';
import { Ingredient } from '../../utils/data_utils/data_utils';
import { useForm } from '../../utils/custom_hooks/form-hook';
import Input from './Input';
import './InputIngredient.css';
import Button from './Button';

type Props = {
  id: string;
  onIngredientChange: (value: Ingredient, isValid: boolean) => void;
  onIngredientDelete: (id: string) => void;
  name: string;
  amount: number;
  unit: string;
};

const InputIngredient = (props: Props) => {
  // Each InputIngredient has its own state storing all the informations about the ingredient
  const { formState, onInputChange } = useForm({
    inputs: {
      name: {
        value: props.name || '',
        isValid: !!props.name,
      },
      amount: {
        value: props.amount || '',
        isValid: !!props.amount,
      },
      unit: {
        value: props.unit || '',
        isValid: !!props.unit,
      },
    },
    formIsValid: !!props.name,
  });

  //console.log('InputIngredient', formState);

  // notify the component that includes this one sending an Ingredient object and the global validity
  const { id, onIngredientChange } = props;
  useEffect(() => {
    const ingredientState: Ingredient = {
      id: id,
      name: formState.inputs.name.value,
      amount: Number(formState.inputs.amount.value),
      unit: formState.inputs.unit.value,
    };
    onIngredientChange(ingredientState, formState.formIsValid);
  }, [onIngredientChange, id, formState]);

  const name = formState.inputs.name.value;
  const amount = formState.inputs.amount.value;
  const unit = formState.inputs.unit.value;

  return (
    <div key={props.id} className="inputingredient__heading">
      <Button
        key={props.id + 'button'}
        className="inputingredient__button"
        onClick={() => {
          props.onIngredientDelete(props.id);
        }}
        inverse
        size="small"
      >
        X
      </Button>

      <div className="inputingredient__container">
        <div className="inputingredient__input inputingredient__input--name">
          <Input
            key={props.id + 'name'}
            id={'name'}
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED]}
            label={'Nome'}
            initialValue={name}
            initialIsValid={!!name}
          />
        </div>
        <div className="inputingredient__input inputingredient__input--amount">
          <Input
            key={props.id + 'amount'}
            id={'amount'}
            valueType="number"
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED, VALIDATOR_POSITIVE_NUMBER]}
            label={'Quantità'}
            initialValue={'' + amount}
            initialIsValid={!!amount && amount > 0}
          />
        </div>
        <div className="inputingredient__input inputingredient__input--unit">
          <Input
            key={props.id + 'unit'}
            id={'unit'}
            onInputChange={onInputChange}
            validators={[VALIDATOR_REQUIRED]}
            label={'Unità di misura'}
            initialValue={unit}
            initialIsValid={!!unit}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(InputIngredient);
