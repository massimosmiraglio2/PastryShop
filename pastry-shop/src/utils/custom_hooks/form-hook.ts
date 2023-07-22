import { useCallback, useReducer } from 'react';

export type FormState = {
  inputs: {
    [k: string]: {
      value: any;
      isValid: boolean;
    };
  };

  formIsValid: boolean;
};

export type FormAction = {
  type: string;
  inputId?: string;
  value: any;
  isValid?: boolean;
};

const formReducer = (state: FormState, action: FormAction) => {
  let formIsValid: boolean = true;

  switch (action.type) {
    case 'data-changed':
      if (!action.inputId || action.isValid === undefined) {
        return state;
      }
      const changedInputId = action.inputId;

      // the current state of the input with the id as changedInputId
      const currentInputState = state.inputs[changedInputId];

      // returns the identical previous state but with the new value of the input changed
      const retState = {
        ...state, //copy all values of state
        inputs: {
          ...state.inputs, //copy all values of state.inputs
          [changedInputId]: {
            //change only the values of the input with id changedInputId
            ...currentInputState, //copy all values of currentInputState and then replace value and isValid
            value: action.value,
            isValid: action.isValid,
          },
        },
      };

      // calculate the formIsValid checking all the isValid of the inputs
      for (const inputId in retState.inputs) {
        formIsValid = formIsValid && retState.inputs[inputId].isValid;
      }

      return { ...retState, formIsValid };

    case 'set-data':
      const newState: FormState = action.value;

      formIsValid = true;
      for (const inputId in newState.inputs) {
        formIsValid = formIsValid && newState.inputs[inputId].isValid;
      }

      return { ...newState, formIsValid };

    default:
      return state;
  }
};

export function useForm(initialState: FormState) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  // this function is returned to keep track of the state of every input
  // it should be passed to each Input component to update the form state
  const onInputChange = useCallback(
    (inputId: string, value: any, isValid: boolean) => {
      dispatch({
        type: 'data-changed',
        inputId: inputId,
        value: value,
        isValid: isValid,
      });
    },
    []
  );

  // this function is returned to allow the caller to set the state of the form
  const setData = useCallback((value: FormState) => {
    dispatch({
      type: 'set-data',
      value,
    });
  }, []);

  return { formState, onInputChange, setData };
}
