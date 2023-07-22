export type InputValidator = (value: string) => boolean;

export const VALIDATOR_REQUIRED: InputValidator = (value: string) => {
  return value.trim().length > 0;
};

export const VALIDATOR_EMAIL: InputValidator = (value: string) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(String(value));
};

export const VALIDATOR_NUMBER: InputValidator = (value: string) => {
  return !isNaN(+value);
};

export const VALIDATOR_POSITIVE_NUMBER: InputValidator = (value: string) => {
  return VALIDATOR_NUMBER(value) && +value > 0;
};

export function validate(value: string, validators: InputValidator[]): boolean {
  const validations = validators.map((validator) => validator(value));
  return validations.reduce(
    (accumulator, currValue) => accumulator && currValue,
    true
  );
}
