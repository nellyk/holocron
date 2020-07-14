/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,either express
 * or implied. See the License for the specific language governing permissions and limitations
 * under the License.
 */

import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import useModuleRegistry from './useModuleRegistry';
import useHolocronPlugins from './useHolocronPlugins';
import createHolocronStore from '../createHolocronStore';

export const HolocronContext = React.createContext({});

export function useHolocronContext() {
  return React.useContext(HolocronContext);
}

export default function useHolocron(options = {}) {
  const {
    // store props
    reducer = (state) => state,
    initialState,
    enhancer,
    localsForBuildInitialState,
    extraThunkArguments,
    // registry config
    modules,
    blockedModules,
    holocronModuleMap,
    // plugins
    plugins: initialPlugins,
  } = options;

  const plugins = useHolocronPlugins(initialPlugins);
  const registry = useModuleRegistry(holocronModuleMap, modules, blockedModules);
  const [store] = React.useState(() => createHolocronStore({
    reducer,
    initialState,
    enhancer,
    localsForBuildInitialState,
    extraThunkArguments,
  }));

  const getContext = useMemo(
    () => () => ({
      store, registry, plugins, rebuildReducer: store.rebuildReducer,
    }),
    [store, registry, plugins]
  );

  return React.useMemo(() => {
    // eslint-disable-next-line no-underscore-dangle
    function __Holocron__({ children }) {
      return (
        <HolocronContext.Provider value={getContext()}>
          <Provider store={store}>
            {plugins.renderEnhancers(children, getContext())}
          </Provider>
        </HolocronContext.Provider>
      );
    }
    __Holocron__.propTypes = {
      children: PropTypes.node,
    };
    __Holocron__.defaultProps = {
      children: null,
    };
    __Holocron__.getContext = getContext;
    return __Holocron__;
  }, [store, getContext]);
}

export function Holocron({ children, ...props }) {
  // eslint-disable-next-line no-underscore-dangle
  const __Holocron__ = useHolocron(props);
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <__Holocron__>
      {children}
    </__Holocron__>
  );
}
Holocron.propTypes = {
  children: PropTypes.node,
};
Holocron.defaultProps = {
  children: null,
};
