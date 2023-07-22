import { useCallback, useEffect, useReducer, useRef } from 'react';

import { InputValidator, validate } from '../../utils/data_utils/validators';
import './Input.css';

type Props = {
  id: string;
  onInputChange: (id: string, value: string, isValid: boolean) => void;
  validators: InputValidator[];
  label: string;
  errorText?: string;
  valueType?: string;
  initialValue?: string;
  initialIsValid?: boolean;
};

type InputState = {
  value: string;
  isValid: boolean;
  isTouched: boolean;
};

type InputAction = {
  type: string;
  value?: string;
};

const Input = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputReducer = useCallback(
    (state: InputState, action: InputAction) => {
      action.value = action.value || '';

      switch (action.type) {
        case 'input-changed':
          return {
            ...state,
            value: action.value,
            isValid: validate(action.value, props.validators),
          };

        case 'input-touched':
          return {
            ...state,
            isTouched: true,
          };
        default:
          return state;
      }
    },
    [props.validators]
  );

  // inizializing and keeping track of the input state and the dispatching function
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialIsValid || false,
    isTouched: false,
  });

  //console.log('re-render for: ' + props.id, inputState);

  // on each re-render, if id or value changed the function onInput would be called
  const { onInputChange } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInputChange(props.id, value, isValid);
  }, [props.id, value, isValid, onInputChange]);

  // the handler for key down: when user press a backspace key or Del key
  const pressDownHandler = (event: { keyCode: number; charCode: number }) => {
    /*
    var key = event.keyCode || event.charCode;
    if (key == 8 || key == 46) {
      const val: string = inputRef.current?.value || '';
      console.log('backspace or del pressed: ', val);	
      dispatch({ type: 'input-changed', value: val });
    }*/
  };

  // the handler for the change event: it updates the internal state of the component
  const changeHandler = (event: { target: { value: string } }) => {
    const val = event.target.value;
    dispatch({ type: 'input-changed', value: val });
  };

  // the handler for the blur event: it updates the internal isTouched state of the component
  const touchHandler = () => {
    dispatch({ type: 'input-touched' });
  };

  const element = (
    <input
      ref={inputRef}
      id={props.id}
      type={props.valueType || 'text'}
      onChange={changeHandler}
      onKeyDown={pressDownHandler}
      onBlur={touchHandler}
      value={value}
    />
  );

  return (
    <div
      className={`input__container ${
        inputState.isTouched && !inputState.isValid
          ? 'input__container--invalid'
          : ''
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {inputState.isTouched && !inputState.isValid && (
        <p>{props.errorText || 'Valore non valido'}</p>
      )}
    </div>
  );
};

export default Input;
