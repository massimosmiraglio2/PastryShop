import React from 'react';

import './Button.css';
import { Link } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  className?: string;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  size?: string;
  inverse?: boolean;
  disabled?: boolean;
};

function Button(props: Props) {
  let content = null;

  if (props.to) {
    content = (
      <Link
        to={props.to || '/'}
        className={
          'button' +
          (props.size ? ` button--size${props.size}` : '') +
          (props.inverse ? ' button--inverse' : '') +
          (props.disabled ? ' button--disabled' : '') +
          (props.className ? ' ' + props.className : '')
        }
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    );
  } else {
    content = (
      <button
        className={
          'button' +
          (props.size ? ` button--size${props.size}` : '') +
          (props.inverse ? ' button--inverse' : '') +
          (props.disabled ? ' button--disabled' : '') +
          (props.className ? ' ' + props.className : '')
        }
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  }

  return <span>{content}</span>;
}

export default Button;
