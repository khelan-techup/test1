 import React from 'react';
 import ReactDOM from 'react-dom';
 import NGSLaboratory from './NGSLaboratory';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><NGSLaboratory /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
