 import React from 'react';
 import ReactDOM from 'react-dom';
import DoctorDetails from './DoctorDetails';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><DoctorDetails /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
