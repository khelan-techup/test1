 import React from 'react';
 import ReactDOM from 'react-dom';
import Disease from './Disease';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><Disease /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
