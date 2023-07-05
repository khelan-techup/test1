 import React from 'react';
 import ReactDOM from 'react-dom';
import PatientDetails from './PatientDetails';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><PatientDetails /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
