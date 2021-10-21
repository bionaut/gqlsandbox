import React from 'react';
import ReactDOM from 'react-dom';
import {StudioClientProvider} from './apollo/apollo-client-provider'
import {Sample} from './sample'

ReactDOM.render(
  <StudioClientProvider>
      <Sample />
  </StudioClientProvider>,
  document.getElementById('root')
);

