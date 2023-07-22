import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

type Props = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function Backdrop(props: Props) {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.querySelector('#backdrop-hook') as Element
  );
}

export default Backdrop;
