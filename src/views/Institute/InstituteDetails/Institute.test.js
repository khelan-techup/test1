 import React from 'react';
 import ReactDOM from 'react-dom';
import InstituteDetails from './InstituteDetails';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><InstituteDetails /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
