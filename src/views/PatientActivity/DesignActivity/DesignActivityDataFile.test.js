 import React from 'react';
 import ReactDOM from 'react-dom';
import DesignActivity from './DesignActivity';

 it('renders without crashing', () => {
   const div = document.createElement('div');
   ReactDOM.render(<MemoryRouter><DesignActivity /></MemoryRouter>, div);
   ReactDOM.unmountComponentAtNode(div);
 });
