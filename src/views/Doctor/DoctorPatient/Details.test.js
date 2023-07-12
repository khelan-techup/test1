 import React from 'react';
 import ReactDOM from 'react-dom';
import DoctorPatient from './DoctorPatient';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><DoctorPatient /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
