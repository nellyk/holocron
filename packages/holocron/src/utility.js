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

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {
  REDUCER_KEY,
  LOAD_KEY,
  INIT_MODULE_STATE,
} from './ducks/constants';

export function isBrowser() {
  return !!global.BROWSER;
}

export function getGlobalInitialState() {
  // eslint-disable-next-line no-underscore-dangle
  return global.__INITIAL_STATE__;
}

export function getModuleDisplayName(name) {
  return `HolocronModule(${name})`;
}

export function getModuleName(Module) {
  return Module ? Module.displayName || Module.name : 'module';
}

export const getInitialState = (Module, props) => props.initialState
  || Module.holocron.initialState
  || (
    typeof props.reducer === 'function'
    && props.reducer(undefined, { type: INIT_MODULE_STATE })
  )
  || (
    typeof Module.holocron.reducer === 'function'
    && Module.holocron.reducer(undefined, { type: INIT_MODULE_STATE })
  );

export const getShouldModuleReload = (Module) => (
  Module.holocron.shouldModuleReload
    ? (prevProps, nextProps) => !Module.holocron.shouldModuleReload(prevProps, nextProps)
    : undefined);

export const getMergeProps = (Module, onMergeProps, defaultProps) => {
  if (Module && typeof Module.holocron.mergeProps === 'function') {
    return onMergeProps(Module.holocron.mergeProps) || defaultProps;
  }
  return defaultProps || undefined;
};

export const createLoad = (load) => (props) => (dispatch) => dispatch(load(props));
export const createLoadModuleData = (
  loadModuleData,
  Module
) => (props) => (dispatch, getState, { fetchClient }) => loadModuleData({
  store: { dispatch, getState },
  fetchClient,
  ownProps: props,
  module: Module,
});
export const getLoader = (Module, props) => {
  const getLoad = () => props.load || Module.holocron.load;
  const getLoadModuleData = () => props.loadModuleData
    || Module.holocron.loadModuleData
    || Module.loadModuleData;
  let loader = () => undefined;
  if (getLoad()) {
    console.warn(`The Holocron Config in '${Module.displayName}' is using the 'load' function which has been deprecated. Please use 'loadModuleData' instead.`);
    // TODO: deprecation (load) - remove in next major version
    loader = createLoad(getLoad());
  } else if (getLoadModuleData()) {
    loader = createLoadModuleData(getLoadModuleData(), Module);
  }
  return (...args) => Promise.resolve(loader(...args)).catch((error) => {
    console.error(`Error while attempting to call 'load' or 'loadModuleData' inside Holocron module ${Module.holocron.name}.`, error);
  });
};

// eslint-disable-next-line complexity
export function validateModule(Module, withConfig) {
  const config = {
    name: 'module',
    ...{ options: {} },
    ...withConfig || {},
    ...Module.holocron || {},
  };

  if (Module[REDUCER_KEY] && !config.reducer) {
    config.reducer = Module[REDUCER_KEY];
  } else if (config.reducer && !Module[REDUCER_KEY]) {
    // eslint-disable-next-line no-param-reassign
    Module[REDUCER_KEY] = config.reducer;
  }

  if (config.load && !Module[LOAD_KEY] && config.options.ssr) {
    // eslint-disable-next-line no-param-reassign
    Module[LOAD_KEY] = config.load;
  }

  if (Module.loadModuleData && !config.loadModuleData) {
    config.loadModuleData = Module.loadModuleData;
  }

  // eslint-disable-next-line no-param-reassign
  Module.holocron = {
    ...config,
  };

  return Module;
}

export function memoizeHolocronModule(Module, HolocronWrapper) {
  const HolocronModule = validateModule(Module);
  return hoistNonReactStatics(
    React.memo(
      hoistNonReactStatics(HolocronWrapper, HolocronModule),
      getShouldModuleReload(HolocronModule)
    ),
    HolocronWrapper,
    {
      displayName: getModuleDisplayName(getModuleName(HolocronModule)),
    }
  );
}
