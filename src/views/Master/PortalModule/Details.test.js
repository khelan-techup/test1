import React from 'react';
import ReactDOM from 'react-dom';
import PortalModule from './PortalModule';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><PortalModule /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
