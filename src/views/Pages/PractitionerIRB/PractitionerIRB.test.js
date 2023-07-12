import React from 'react';
import ReactDOM from 'react-dom';
import PractitionerIRB from './PractitionerIRB';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PractitionerIRB />, div);
  ReactDOM.unmountComponentAtNode(div);
});
