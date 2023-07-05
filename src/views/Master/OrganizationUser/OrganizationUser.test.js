 import React from 'react';
 import ReactDOM from 'react-dom';
import OrganizationUser from './OrganizationUser';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><OrganizationUser /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
