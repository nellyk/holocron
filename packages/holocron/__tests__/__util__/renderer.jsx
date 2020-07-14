// test-utils.js
import React from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';

import { Holocron } from '../../src/hooks/useHolocron';
import createHolocronStore from '../../src/createHolocronStore';

export const HolocronWrapper = ({
  // eslint-disable-next-line react/prop-types
  children, reducer, initialState, holocronModuleMap, modules,
}) => (
  <Holocron
    reducer={reducer}
    initialState={initialState}
    holocronModuleMap={holocronModuleMap}
    modules={modules}
  >
    {typeof children === 'function' ? children() : children}
  </Holocron>
);

// eslint-disable-next-line react/prop-types
export const ReduxWrapper = ({ children, store: storeProp, initialState }) => {
  const store = storeProp || createHolocronStore({
    reducer: (state) => state,
    initialState,
  });
  jest.spyOn(store, 'dispatch');

  return (
    <Provider store={store}>
      {typeof children === 'function' ? children(store) : children}
    </Provider>
  );
};

const customRender = (children, options = {}) => render(
  children,
  { wrapper: options.wrap && ReduxWrapper, ...options }
);

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// override render method
export { customRender as render };
