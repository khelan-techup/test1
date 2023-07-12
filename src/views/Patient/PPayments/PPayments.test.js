 import React from 'react';
 import ReactDOM from 'react-dom';
import PPayments from './PPayments';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><PPayments /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
