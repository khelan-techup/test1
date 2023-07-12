 import React from 'react';
 import ReactDOM from 'react-dom';
import InstitutePatient from './InstitutePatient';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><InstitutePatient /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
