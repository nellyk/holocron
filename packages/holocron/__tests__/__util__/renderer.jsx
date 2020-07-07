// test-utils.js
import React from 'react';
import { Provider } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'react-test-renderer';

import createHolocronStore from '../../src/createHolocronStore';

const wrapReduxProvider = ({
  // eslint-disable-next-line react/prop-types
  children, initialState, fetchClient, enhancer,
  // eslint-disable-next-line react/prop-types
  localsForBuildInitialState, store: providedStore,
}) => {
  const store = providedStore || createHolocronStore({
    reducer: (state) => state,
    initialState,
    enhancer,
    localsForBuildInitialState,
    extraThunkArguments: {
      fetchClient,
    },
  });

  // console.log(store.getState().toJS(), initialState.toJS());

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

const customRender = (
  children, {
    store,
    initialState,
    fetchClient,
    enhancer,
    localsForBuildInitialState,
    ...options
  } = {}
) => create(wrapReduxProvider({
  children,
  store,
  initialState,
  fetchClient,
  enhancer,
  localsForBuildInitialState,
}), options);
// const customRender = (ui, options) => render(ui, { wrapper: wrapReduxProvider, ...options });

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// override render method
export { customRender as render };
