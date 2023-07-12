 import React from 'react';
 import ReactDOM from 'react-dom';
import PSamples from './PSamples';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><PSamples /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
