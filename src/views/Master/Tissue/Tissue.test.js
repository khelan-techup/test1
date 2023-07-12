import React from 'react';
import ReactDOM from 'react-dom';
import Tissue from './Tissue';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Tissue /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
